from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from fastapi.encoders import jsonable_encoder
import json
import datetime
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

class Fire(BaseModel):
    number : int
    flame: List[int]
    gas: int
    temp: List[int]

@app.get("/fire-alarm/alarm")
def alarm():
    lst = list(avg_collection.find({'number':1},{'_id':0})) #search number:1
    if(len(lst) == 1):
        flame = 1 if sum(lst[0]['flame']) >= 50 else 0
        gas = 1 if lst[0]['gas'] >= 2000 else 0
        temp = 1 if sum(lst[0]['flame']) >= 58 else 0
        return { 'flame': flame, 'gas':gas, 'temp':temp }
    else:
        raise HTTPException(404, "Not have data of this number.")