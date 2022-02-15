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


class Fire(BaseModel):
    number: int
    gas: List[int]
    fire: List[int]
    temp: int

@app.get("/fire-alarm/status")
def result():
    result = menu_collection.find_one()

    #ดูว่ามีค่าของ sensor temp ต่างกันเกินไหม & เลือก
    checkTemp1 = (abs(result["temp"][0] - result["temp"][1]) / result["temp"][0])*100
    checkTemp2 = (abs(result["temp"][0] - result["temp"][2]) / result["temp"][0])*100
    checkTemp3 = (abs(result["temp"][1] - result["temp"][2]) / result["temp"][0])*100
    
    sum = 0 
    sensors = 0
    if (checkTemp1 < 10 and checkTemp2 < 10) or (checkTemp1 < 10 and checkTemp3 < 10):
        sum = result["temp"][0] + result["temp"][1] + result["temp"][2]
        sensors = 3
    elif checkTemp1 < 10 :
        sum = result["temp"][0] + result["temp"][1]
        sensors = 2
    elif checkTemp2 < 10 :
        sum = result["temp"][0] + result["temp"][2]
        sensors = 2
    elif checkTemp3 < 10 :
        sum = result["temp"][1] + result["temp"][2]
        sensors = 2
    else:
        sum = result["temp"][0] + result["temp"][1] + result["temp"][2]
        sensors = 3

    avgTemp = sum / sensors

    #ดูว่ามีค่าของ sensor flame ต่างกันเกินไหม & เลือก
    checkFlame1 = (abs(result["flame"][0] - result["flame"][1]) / result["flame"][0])*100
    checkFlame2 = (abs(result["flame"][0] - result["flame"][2]) / result["flame"][0])*100
    checkFlame3 = (abs(result["flame"][1] - result["flame"][2]) / result["flame"][0])*100
    
    sum = 0 
    sensors = 0
    if (checkFlame1 < 10 and checkFlame2 < 10) or (checkFlame1 < 10 and checkFlame3 < 10):
        sum = result["flame"][0] + result["flame"][1] + result["flame"][2]
        sensors = 3
    elif checkFlame1 < 10 :
        sum = result["flame"][0] + result["flame"][1]
        sensors = 2
    elif checkFlame2 < 10 :
        sum = result["flame"][0] + result["flame"][2]
        sensors = 2
    elif checkFlame3 < 10 :
        sum = result["flame"][1] + result["flame"][2]
        sensors = 2
    else:
        sum = result["flame"][0] + result["flame"][1] + result["flame"][2]
        sensors = 3

    avgflame = sum / sensors
    
    gas = result["gas"]

    return {
        "status1" : checkTemp1,
        "status2" : checkTemp2,
        "status3" : checkTemp3
    }