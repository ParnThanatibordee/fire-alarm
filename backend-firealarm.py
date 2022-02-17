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


@app.get("/fire-alarm/get-record")
def get_fire_record():
    room = db['record_avg'].find({})
    result = []
    print('room:', room)
    for r in room:
        result.append(
            {'fire': sum(r['flame']) / len(r['flame']), 'temp': sum(r['temp']) / len(r['temp']), 'ref_temp': 50, 'gas': r['gas'],
             'ref_gas': 2000})  # default ref temp 50-58, ref gas 2000-5000
        print(r)
    return {'Room': result}  # result
