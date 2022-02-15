from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
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
    gas: int
    temp: int
    fire: int
