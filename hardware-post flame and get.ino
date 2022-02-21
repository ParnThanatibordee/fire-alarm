#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <math.h>
//com4

const char* ssid = "realme narzo 30A";
const char* password = "13bb425d1ab9";
const char* url_get = "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/alarm/1";
const char* url_post = "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/update1/1";

//25,26,27,14,12,13,15,2,0,4
int led1 = 21;
int led2 = 22;

int inFlame1 = 34;
int inFlame2 = 39;
int inFlame3 = 36;

int buzz1 = 19;
int buzz2 = 18;

float outFlame1;
float outFlame2;
float outFlame3;

char str[50];


int warnGas = 0;
int warnFlame = 0;
int warnTemp = 0;

const int _size = 2*JSON_OBJECT_SIZE(10);

StaticJsonDocument<_size> JSONGet;
StaticJsonDocument<_size> JSONPost;

void WiFi_Connect(){
  WiFi.disconnect();
  WiFi.begin(ssid,password);
  while(WiFi.status()!=WL_CONNECTED){
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to the WiFi network");
  Serial.print("IP Address : ");
  Serial.println(WiFi.localIP());
}



void _get() {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;

    http.begin(url_get);

    int httpCode = http.GET();

    if(httpCode == HTTP_CODE_OK){
      String payload = http.getString();
      DeserializationError err = deserializeJson(JSONGet, payload);
      if(err){
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(err.c_str());
      } else{
        Serial.println(httpCode);
        warnGas = JSONGet["gas"];
        warnFlame = JSONGet["flame"];
        warnTemp = JSONGet["temp"];
        Serial.println("GET result");
        Serial.printf("warnGas : %d\n", warnGas);
        Serial.printf("warnFlame : %d\n", warnFlame);
        Serial.printf("warnTemp : %d\n", warnTemp);
      }
    } else{
      Serial.println(httpCode);
      Serial.println("ERROR on HTTP Request");
    }
  } else{
    WiFi_Connect();
  }
}

void _post(){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    http.begin(url_post);
    http.addHeader("Content-Type", "application/json");

    //Serial.println(outFlame1);
    //Serial.println(outGas);
    //Serial.println(temp1);
    
    //JSONPost["gas"] = outGas;
    JSONPost["flame1"] = outFlame1;
    JSONPost["flame2"] = outFlame2;
    JSONPost["flame3"] = outFlame3;
    //JSONPost["temp1"] = temp1;
    //JSONPost["temp2"] = temp2;
    //JSONPost["temp3"] = temp3;
    //Serial.println("SEND!");

    serializeJson(JSONPost, str);
    int httpCode = http.POST(str);

    if(httpCode == HTTP_CODE_OK){
      String payload = http.getString();
      Serial.println(httpCode);     
      Serial.println("POST result");
      Serial.println(payload);
    } else{
      Serial.println(httpCode);
      Serial.println("ERROR on HTTP Request");
    }
  } else{
    WiFi_Connect();
  }
  delay(10);
}

void setup() {
  xTaskCreatePinnedToCore(TaskA, "Task A", 1024*32, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(TaskB, "Task B", 1024*32, NULL, 1, NULL, 0);
  ledcSetup(0,2000,8);
  ledcAttachPin(buzz2,0);
  
  pinMode(inFlame1, INPUT);
  pinMode(inFlame2, INPUT);
  pinMode(inFlame3, INPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(buzz1, OUTPUT);
  pinMode(buzz2, OUTPUT);

  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(buzz1, LOW);
  Serial.begin(9600);
  WiFi_Connect();
}

void TaskA(void *parameter){
  while(1){
    outFlame1 = analogRead(inFlame1);
    outFlame2 = analogRead(inFlame2);
    outFlame3 = analogRead(inFlame3);    
    
    vTaskDelay(10/portTICK_PERIOD_MS);
  }
}

void TaskB(void *parameter){
  while(1){
    if(warnGas == 0 && warnTemp == 0 && warnFlame == 0){
      digitalWrite(led1, LOW);
      digitalWrite(led2, LOW);
      ledcWriteTone(0,0);
      digitalWrite(buzz1, LOW);
    }
    if(warnFlame == 1){
      digitalWrite(buzz1, LOW);
      digitalWrite(led1, HIGH);
      digitalWrite(led2, HIGH);
      ledcWriteTone(0,1500);
      vTaskDelay(250 / portTICK_PERIOD_MS);
      digitalWrite(led1, LOW);
      digitalWrite(led2, LOW);
      ledcWriteTone(0,1000);
      vTaskDelay(250 / portTICK_PERIOD_MS);//75
    } /*else {
      ledcWriteTone(0,0);
      vTaskDelay(250 / portTICK_PERIOD_MS);
    }*/
    if(warnTemp == 1 && warnGas == 0 && warnFlame == 0){      
      digitalWrite(led1, HIGH);//led on
      digitalWrite(led2, LOW);
      ledcWriteTone(0,0);
      digitalWrite(buzz1, LOW);
      vTaskDelay(250 / portTICK_PERIOD_MS);
      digitalWrite(led1, LOW);//led off
      vTaskDelay(250 / portTICK_PERIOD_MS);      
    }    
    if(warnGas == 1 && warnTemp == 0 && warnFlame == 0){
      digitalWrite(led1, LOW);
      digitalWrite(led2, LOW);
      ledcWriteTone(0,0);
      digitalWrite(buzz1, HIGH);
      vTaskDelay(175 / portTICK_PERIOD_MS);
      digitalWrite(buzz1, LOW);
      vTaskDelay(175 / portTICK_PERIOD_MS);
    }
    if(warnGas == 1 && warnTemp == 1 && warnFlame == 0){
      digitalWrite(led2, LOW);
      ledcWriteTone(0,0);
      digitalWrite(led1, HIGH);
      digitalWrite(buzz1, HIGH);
      vTaskDelay(175 / portTICK_PERIOD_MS);
      digitalWrite(led1, LOW);
      digitalWrite(buzz1, LOW);
      vTaskDelay(175 / portTICK_PERIOD_MS);     
    } /*else{
      digitalWrite(led1, LOW);
      digitalWrite(buzz1, LOW);
      vTaskDelay(175 / portTICK_PERIOD_MS);
    }*/
    
    vTaskDelay(10 / portTICK_PERIOD_MS); 
  }
}

void loop() {
  
  _post();
  _get(); 
  Serial.println("=============");
  Serial.printf("flame1 : %lf\n", outFlame1);
  Serial.printf("flame2 : %lf\n", outFlame2);
  Serial.printf("flame3 : %lf\n", outFlame3);
  Serial.println("=============");
  delay(1000);
  
}
