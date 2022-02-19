from cgi import print_form
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import requests

SECRET_KEY = "6449df181d2b4ea7fd5063d9dda7e7acad40a5bb34b02c5af7e609f1914dd812"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str


class UserRegistration(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: str


class Alarm(BaseModel):
    gas: float
    flame1: float
    flame2: float
    flame3: float
    temp1: float
    temp2: float
    temp3: float


class Configure(BaseModel):
    number: int
    place: str
    line_token: str
    ref_gas: float
    ref_temp: float
    flame_notification: bool
    gas_notification: bool
    temp_notification: bool
    line_notification: bool


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# remove error in case of some sensor is broken
def removeError(lst: list):
    # calculate percentage discrepancy
    chk1 = (abs(lst[0] - lst[1]) / lst[0]) * 100
    chk2 = (abs(lst[0] - lst[2]) / lst[0]) * 100
    chk3 = (abs(lst[1] - lst[2]) / lst[0]) * 100

    sum = 0
    sensors = 0
    if (chk1 < 20 and chk2 < 20) or (chk1 < 20 and chk3 < 20):
        sum = lst[0] + lst[1] + lst[2]
        sensors = 3
    elif chk1 < 20:
        sum = lst[0] + lst[1]
        sensors = 2
    elif chk2 < 20:
        sum = lst[0] + lst[2]
        sensors = 2
    elif chk3 < 20:
        sum = lst[1] + lst[2]
        sensors = 2
    else:
        sum = lst[0] + lst[1] + lst[2]
        sensors = 3

    res = sum / sensors
    return res


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# get record of average value
@app.get("/fire-alarm/get-record")  # get-frontend
def get_fire_record(current_user: User = Depends(get_current_active_user)):
    room = avg_collection.find()
    result = []
    for r in room:
        ref = configure_collection.find_one({"number":r['number']})

        emergency = True if (removeError(r['flame']) < ref['ref_flame'] or # check emergency
        r['gas'] > ref['ref_gas'] or removeError(r['temp']) > ref['ref_temp'] ) else False
        
        result.append(
            {   'number': r['number'], 'place': ref['place'],
                'current_flame': True if removeError(r['flame']) < ref['ref_flame'] else False , 
                'current_gas': r['gas'], 'current_temp': removeError(r['temp']),
                'ref_gas': ref['ref_gas'],'ref_temp': ref['ref_temp'],
                'flame_notification': ref['flame_notification'], 
                'gas_notification': ref['gas_notification'],
                'temp_notification': ref['temp_notification'], 
                'line_notification': ref['line_notification'],
                'emergency': emergency
                })  
                # default ref temp 50-58, ref gas 2000-5000

    if room:
        return {'room': result}
    else:
        raise HTTPException(404, "Not have data of any alarm.")


# config the setting status for example, set reference value, turn on/off line notification etc.
@app.post("/fire-alarm/configure")  # post-frontend
def configure(alarm: Configure, current_user: User = Depends(get_current_active_user)):
    chk = configure_collection.find_one({'number': alarm.number}, {'_id': 0})
    if chk: # update configure_collection
        new = { "$set": {"place": alarm.place, "line_token": alarm.line_token,
                "ref_gas": alarm.ref_gas, "ref_temp": alarm.ref_temp,
                "flame_notification": alarm.flame_notification, "gas_notification": alarm.gas_notification,
                "temp_notification": alarm.temp_notification, "line_notification": alarm.line_notification,
                "update_time": datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}}

        query = {'number': alarm.number}
        configure_collection.update_one(query, new)
        return {
            "result": "Update completed."
        }
    else:
        raise HTTPException(404, "Not have data of this number.")


# alarm the normal or warning status
@app.get("/fire-alarm/alarm/{num}")  # get-hardware
def alarm(num: int):
    alarm = avg_collection.find_one({'number': num}, {'_id': 0})  # search number:1
    if alarm:  # Check if an alarming is required
        ref = configure_collection.find_one({'number': alarm['number']}, {'_id': 0})
        flame = 1 if removeError(alarm['flame']) < ref['ref_flame'] else 0
        gas = 1 if alarm['gas'] > ref['ref_gas'] else 0
        temp = 1 if removeError(alarm['temp']) > ref['ref_temp'] else 0
        return {'flame': flame, 'gas': gas, 'temp': temp}
    else:
        raise HTTPException(404, "Not have data of this number.")


# send line notify message to line token
def line_notify(alarm: dict):
    ref = configure_collection.find_one({'number': alarm['number']}, {'_id': 0})
    if ref['line_token']  and ref['line_notification']:  # user set line_token and notification is on
        if (alarm['flame'] < ref['ref_flame'] or
                alarm['gas'] > ref['ref_gas'] or alarm['temp'] > ref['ref_temp']):
            msg = "Warning!!\n"
            if ref['place']:
                msg += f"At {ref['place']}\n"
            if alarm['flame'] < ref['ref_flame']:
                msg += f"Flame occurred.\n"
            if alarm['gas'] > ref['ref_gas']:
                msg += f"Gas over {ref['ref_gas']} ppm.\n"
            if alarm['temp'] > ref['ref_temp']:
                msg += f"Temperature over {ref['ref_temp']} degrees Celsius.\n"

            url = 'https://notify-api.line.me/api/notify'
            headers = {'content-type': 'application/x-www-form-urlencoded',
                       'Authorization': 'Bearer ' + ref['line_token']}
            requests.post(url, headers=headers, data={'message': msg})  # send line notification


@app.post("/fire-alarm/update/{num}")  # post-hardware
def update(alarm: Alarm, num: int):
    # add new record
    list_flame = [alarm.flame1, alarm.flame2, alarm.flame3]
    list_temp = [alarm.temp1, alarm.temp2, alarm.temp3]
    alarm_dict = {'number': num, 'flame': list_flame,
                  'gas': alarm.gas, 'temp': list_temp,
                  'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}
    menu_collection.insert_one(alarm_dict)

    # delete old record
    lst = list(menu_collection.find({'number': num}, {'_id': 0}))
    lst.sort(key=lambda x: x['update_time'])  # sort by time for delete excess data
    for i in range(len(lst) - 5):
        menu_collection.delete_one(lst[i])  # delete in db if more than 5

    # add default configure_collection
    chk = configure_collection.find_one({'number': num}, {'_id': 0})
    if not chk:
        default_dict = {'number': num, 'place': None, 'line_token': None,
                        'ref_flame': 500, 'ref_gas': 2000, 'ref_temp': 50,
                        'flame_notification': True, 'gas_notification': True, 
                        'temp_notification': True, 'line_notification': True,
                        'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}
        configure_collection.insert_one(default_dict)

    # update record_avg
    chk = avg_collection.find_one({'number': num}, {'_id': 0})  # check data in avg_collection
    if chk is None:  # if not have data => add new
        avg_collection.insert_one(alarm_dict)
    else:  # if have date => update
        # calculate average record
        avg_flame = []
        avg_temp = []
        lst = list(menu_collection.find({'number': num}, {'_id': 0}))
        for i in range(3):  # 3 sensors
            avg_flame.append(sum(d['flame'][i] for d in lst) / len(lst))
            avg_temp.append(sum(d['temp'][i] for d in lst) / len(lst))
        avg_gas = sum(d['gas'] for d in lst) / len(lst)

        # update
        query = {"number": num}
        new = {"$set": {"flame": avg_flame, "temp": avg_temp,
                        "gas": avg_gas, 'update_time': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')}}
        avg_collection.update_one(query, new)

        # line notify
        res = avg_collection.find_one({"number": num})
        res["flame"] = removeError(avg_flame)
        res["temp"] = removeError(avg_temp)
        line_notify(res)

    return {
        "result": "Update completed."
    }


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# hashed password
def get_password_hash(password):
    return pwd_context.hash(password)


# get data of user in database(mongodb)
def get_user(username: str):
    users = db['users'].find({}, {"_id": 0})
    database = {}
    for i in users:
        database[f"{i['username']}"] = i
    print(database)

    if username in database:
        user_dict = database[username]
        return UserInDB(**user_dict)


# user input password equal to user hashed password
def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# login to grant access_token
@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# create user for test
@app.post('/register')
async def create_user(user: UserRegistration):
    # add event not create if username already exist
    username_exist = []
    email_exist = []
    users = db['users'].find({}, {"_id": 0})
    for i in users:
        username_exist.append(i['username'])
        email_exist.append(i['email'])

    if user.email in email_exist:
        return {
            "result": "This email is already exist."
        }
    elif user.username in username_exist:
        return {
            "result": "This name is already exist."
        }
    print(user)
    registration_user = {"username": user.username, "full_name": user.full_name, "email": user.email,
                         "hashed_password": get_password_hash(user.password), "disabled": False}
    print(registration_user)
    db['users'].insert_one(registration_user)
    return {
        "result": "Successful registration."
    }


# check authentication that user has to login first
@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/users/me/items")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.username}]
