from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from fastapi.encoders import jsonable_encoder
import json
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from pymongo import MongoClient

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

@app.post("/fire-alarm/update")
def update(alarm: Alarm):
    #add new record
    list_flame = [alarm.flame1, alarm.flame2, alarm.flame3]
    list_temp = [alarm.temp1, alarm.temp2, alarm.temp3]
    alarm_dict = {  'number': alarm.number,'address': None, 'flame': list_flame,
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
        for i in range(3):
            avg_flame.append(sum(d['flame'][i] for d in lst)/len(lst))
            avg_temp.append(sum(d['temp'][i] for d in lst)/len(lst))
        avg_gas = sum(d['gas']for d in lst)/len(lst)

        #update avg_collection
        query = {"number": alarm.number}
        new = { "$set":{"flame":avg_flame,"temp":avg_temp,
                "gas":avg_gas,'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}}

        avg_collection.update_one(query, new)
    
    return "update completed."
    