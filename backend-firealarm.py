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

class Alarm(BaseModel):
    number : int
    gas: int
    flame1: int 
    flame2: int 
    flame3: int
    temp1: int 
    temp2: int 
    temp3: int

def line_notify(alarm: dict):
    if alarm['flame'] >= 100 or alarm['gas'] >= 2000 or alarm['temp'] >= 58 :
        msg ="Warning!!\n"
        msg += f"At {alarm['address']}\n"
        if alarm['flame'] >= 100:
            msg += "Flame over 100\n"
        if alarm['gas'] >= 100:
            msg += "Gas over 2000\n"
        if alarm['temp'] >= 100:
            msg += "Temp over 58\n"

        url = 'https://notify-api.line.me/api/notify'
        headers = {'content-type':'application/x-www-form-urlencoded','Authorization':'Bearer '+alarm['line_token']}
        requests.post(url, headers=headers, data = {'message':msg})

@app.post("/fire-alarm/update")
def update(alarm: Alarm, level: int):
    #add new record
    list_flame = [alarm.flame1, alarm.flame2, alarm.flame3]
    list_temp = [alarm.temp1, alarm.temp2, alarm.temp3]
    alarm_dict = {  'number': alarm.number,'address': None, 'line_token': None,
                    'flame': list_flame, 'gas': alarm.gas,'temp': list_temp,
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

        #update avg_collection
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
    