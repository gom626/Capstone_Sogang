/*
 *  This sketch sends a message to a TCP server
 *
 */
// Include the libraries we need
#include <OneWire.h>
#include <string.h>
#include <stdlib.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <WiFiMulti.h>
// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

WiFiMulti WiFiMulti;

void setup()
{
    Serial.begin(115200);
    delay(10);

    // We start by connecting to a WiFi network
    WiFiMulti.addAP("KT_GiGA_2G_Wave2_3CEB", "efc4fcg878");

    Serial.println();
    Serial.println();
    Serial.print("Waiting for WiFi... ");

    while(WiFiMulti.run() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    sensors.begin();
    delay(500);
}


void loop()
{
//  const uint16_t port = 80;
//  const char * host = "192.168.1.1"; // ip or dns
    const uint16_t port = 1337;
    //const char * host = "192.168.1.10"; // ip or dns
    const char * host = "3.83.212.42";
    static int cnt=0;
    float temp;
    cnt++;

    Serial.print("Requesting temperatures...");
    sensors.requestTemperatures(); // Send the command to get temperatures
    Serial.println("DONE");
    // After we got the temperatures, we can print them here.
    // We use the function ByIndex, and as an example get the temperature from the first sensor only.
    Serial.print("Temperature for the device 1 (index 0) is: ");
    Serial.println(sensors.getTempCByIndex(0));
    temp=sensors.getTempCByIndex(0);
    Serial.print("Connecting to ");
    Serial.println(host);

    // Use WiFiClient class to create TCP connections
    WiFiClient client;

    if (!client.connect(host, port)) {
        Serial.println("Connection failed.");
        Serial.println("Waiting 5 seconds before retrying...");
        delay(5000);
        return;
    }
    char str[150];
    char tem[10];
    memset(str,'\0',sizeof(char)*100);
    strcat(str,"GET /device?device_id=77&temperature_value=");
    sprintf(tem,"%.2f",temp);
    strcat(str,tem);
    strcat(str,"&sequence_number=");
    sprintf(tem,"%d",cnt);
    strcat(str,tem);
    strcat(str," HTTP/1.1\n\n");
    Serial.println(str);
    
    client.print(str);
    //http://amazon.url.com:your_port/yourpath?device_id=23&temperature_value=45.56&sequence_number=456 
    int maxloops = 0;

    //wait for the server's reply to become available
    while (!client.available() && maxloops < 1000)
    {
      maxloops++;
      delay(1); //delay 1 msec
    }
    if (client.available() > 0)
    {
      //read back one line from the server
      String line = client.readStringUntil('\r');
      Serial.println(line);
    }
    else
    {
      Serial.println("client.available() timed out ");
    }

    Serial.println("Closing connection.");
    client.stop();
    

     delay(60000);
}
