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

class Fire(BaseModel):
    number : int
    flame: List[int]
    gas: int
    temp: List[int]

@app.post("/fire-alarm/update")
def update(alarm: Fire):
    alarm_dict = {  'number': alarm.number, 'flame': alarm.flame,
                    'gas': alarm.gas,'temp': alarm.temp,
                    'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}
    menu_collection.insert_one(alarm_dict)

    lst = list(menu_collection.find({'number':alarm.number},{'_id':0})) 
    lst.sort(key=lambda x:x['update_time']) #sort for delete excess data
    for i in range(len(lst)-3): #delete in db if more than 3
        menu_collection.delete_one(lst[i])
    
    return "update completed."
    