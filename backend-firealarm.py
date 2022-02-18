from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from fastapi.encoders import jsonable_encoder
import json
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import requests

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb://localhost', 27017)
db = client["fire-alarm"]

menu_collection = db['record']
avg_collection = db['record_avg']
configure_collection = db['configure']

class Alarm(BaseModel):
    number : int
    gas: int
    flame1: int 
    flame2: int 
    flame3: int
    temp1: int 
    temp2: int 
    temp3: int

@app.get("/fire-alarm/alarm") #get-hardware
def alarm():
    lst = list(avg_collection.find({'number':1},{'_id':0})) #search number:1
    ref = configure_collection.find_one({'number':1},{'_id':0})
    if(len(lst) == 1):
        flame = 1 if sum(lst[0]['flame']) > ref['ref_flame'] else 0
        gas = 1 if lst[0]['gas'] > ref['ref_gas'] else 0
        temp = 1 if sum(lst[0]['temp']) > ref['ref_temp'] else 0
        return { 'flame': flame, 'gas':gas, 'temp':temp }
    else:
        raise HTTPException(404, "Not have data of this number.")

@app.get("/fire-alarm/line-noti") 
def line_notify(alarm: dict):
    ref = configure_collection.find_one({'number':alarm['number']},{'_id':0})
    if ref['line_token'] != None and ref['notification']: #user set line_token and notification is on
        if( alarm['flame'] > ref['ref_flame'] or 
            alarm['gas'] > ref['ref_gas'] or alarm['temp'] > ref['ref_temp']) :
            msg ="Warning!!\n"
            if ref['address'] != None:
                msg += f"At {ref['address']}\n"
            if alarm['flame'] > ref['ref_flame']:
                msg += f"Flame over {ref['ref_flame']}\n"
            if alarm['gas'] > ref['ref_gas']:
                msg += f"Gas over {ref['ref_gas']}\n"
            if alarm['temp'] > ref['ref_temp']:
                msg += f"Temp over {ref['ref_temp']}\n"

            url = 'https://notify-api.line.me/api/notify'
            headers = {'content-type':'application/x-www-form-urlencoded','Authorization':'Bearer '+ref['line_token']}
            requests.post(url, headers=headers, data = {'message':msg})

@app.post("/fire-alarm/update") #post-hardware
def update(alarm: Alarm):
    #add new record
    list_flame = [alarm.flame1, alarm.flame2, alarm.flame3]
    list_temp = [alarm.temp1, alarm.temp2, alarm.temp3]
    alarm_dict = {  'number': alarm.number,'flame': list_flame, 
                    'gas': alarm.gas,'temp': list_temp,
                    'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}
    menu_collection.insert_one(alarm_dict)

    #delete old record
    lst = list(menu_collection.find({'number':alarm.number},{'_id':0})) 
    lst.sort(key=lambda x:x['update_time']) #sort by time for delete excess data
    for i in range(len(lst)-3): 
        menu_collection.delete_one(lst[i]) #delete in db if more than 3

    #update record_avg
    chk = list(avg_collection.find({'number':alarm.number},{'_id':0}))  #check len in avg_collection
    if len(chk) == 0: #if not have data -> add new 
        avg_collection.insert_one(alarm_dict)
    else: #if have date -> update 
        #calculate average record
        avg_flame = []
        avg_temp = []
        lst = list(menu_collection.find({'number':alarm.number},{'_id':0}))
        for i in range(len(lst)):
            avg_flame.append(sum(d['flame'][i] for d in lst)/len(lst))
            avg_temp.append(sum(d['temp'][i] for d in lst)/len(lst))
        avg_gas = sum(d['gas']for d in lst)/len(lst)

        #update
        query = {"number": alarm.number}
        new = { "$set":{"flame":avg_flame,"temp":avg_temp,
                "gas":avg_gas,'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}}
        avg_collection.update_one(query, new)

        #line notify
        res = avg_collection.find_one({"number": alarm.number})
        res["flame"] = sum(avg_flame)/len(avg_flame)
        res["temp"] = sum(avg_temp)/len(avg_temp)
        line_notify(res)
    
    return "update completed."

