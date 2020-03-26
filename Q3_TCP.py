import requests
import random
import time
url='https://api.thingspeak.com/update?api_key=HJZH5LSKSXXGTE3B&field1='
for i in range(10):
  value=int(random.random()*100)
  requests.get(url+str(value))
  time.sleep(20)

