#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <math.h>
//com3
const char* ssid = "realme narzo 30A";
const char* password = "13bb425d1ab9";
const char* url_post = "https://ecourse.cpe.ku.ac.th/exceed15/api/fire-alarm/update2/1";


int inTemp1 = 34;
int inTemp2 = 39;
int inTemp3 = 36;
int inGas = 33;

char str[100];

float outTemp1;
float outTemp2;
float outTemp3;
float outGas;
float temp1;
float temp2;
float temp3;

const int _size = 2*JSON_OBJECT_SIZE(10);

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

float Thermistor(int RawADC) {
  float Temp;
  Temp = log(10000.0*abs(512.0/(float)RawADC - 1));//1536
  Temp = 1.0 / (0.001129148 + (0.000234125 + (0.0000000876741 * Temp * Temp ))* Temp );
  Temp = Temp - 273.15; // Convert Kelvin to Celcius
  return Temp;
}

void _post(){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    http.begin(url_post);
    http.addHeader("Content-Type", "application/json");

    //Serial.println(outFlame1);
    //Serial.println(outGas);
    //Serial.println(temp1);
    
    JSONPost["gas"] = outGas;
    //JSONPost["flame1"] = outFlame1;
    //JSONPost["flame2"] = outFlame2;
    //JSONPost["flame3"] = outFlame3;
    JSONPost["temp1"] = temp1;
    JSONPost["temp2"] = temp2;
    JSONPost["temp3"] = temp3;
    Serial.println("SEND!");

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

void TaskA(void *parameter){
  while(1){
    outGas = analogRead(inGas);
    //outFlame1 = analogRead(inFlame1);
    //outFlame2 = analogRead(inFlame2);
    //outFlame3 = analogRead(inFlame3);    
    outTemp1 = analogRead(inTemp1);
    outTemp2 = analogRead(inTemp2);
    outTemp3 = analogRead(inTemp3);
    temp1 = Thermistor(analogRead(inTemp1));
    temp2 = Thermistor(analogRead(inTemp2));
    temp3 = Thermistor(analogRead(inTemp3));
    vTaskDelay(10/portTICK_PERIOD_MS);
  }
}

void setup() {
  xTaskCreatePinnedToCore(TaskA, "Task A", 1024*32, NULL, 1, NULL, 0);
  /*pinMode(inFlame1, INPUT);
  pinMode(inFlame2, INPUT);
  pinMode(inFlame3, INPUT);*/
  pinMode(inGas, INPUT);
  pinMode(inTemp1, INPUT);
  pinMode(inTemp2, INPUT);
  pinMode(inTemp3, INPUT);

  Serial.begin(9600);
  WiFi_Connect();
}

void loop() {
  _post();
  Serial.println("=============");
  Serial.printf("gas : %lf\n", outGas);
  /*Serial.printf("flame1 : %lf\n", outFlame1);
  Serial.printf("flame2 : %lf\n", outFlame2);
  Serial.printf("flame3 : %lf\n", outFlame3);*/ 
  Serial.printf("temp1 : %lf\n", outTemp1);
  Serial.printf("temp2 : %lf\n", outTemp2);
  Serial.printf("temp3 : %lf\n", outTemp3);
  //int readVal= outTemp1;
  //double temp = Thermistor(readVal);
  Serial.printf("temp1 formula : %lf\n", temp1);
  Serial.printf("temp2 formula : %lf\n", temp2);
  Serial.printf("temp3 formula : %lf\n", temp3);
  Serial.println("=============");
  delay(1000);
}
