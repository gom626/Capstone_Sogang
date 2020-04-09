
int RLED=4;
int YLED=5;
int BLED=6;
int GLED=7;
int trig=2;
int echo=3;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(11500);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(RLED, OUTPUT);
  pinMode(YLED, OUTPUT);
  pinMode(BLED, OUTPUT);
  pinMode(GLED, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(trig, HIGH);
  delay(10);
  digitalWrite(trig, LOW);
  int distance = pulseIn(echo, HIGH)*34/2/1000;
  Serial.println(distance);
  delay(100);
  if(0<distance && distance <10){
    digitalWrite(RLED, HIGH);
    digitalWrite(YLED, LOW);
    digitalWrite(BLED, LOW);
    digitalWrite(GLED, LOW);
  }
  else if(10<=distance && distance < 20){
    digitalWrite(RLED, LOW);
    digitalWrite(YLED, HIGH);
    digitalWrite(BLED, LOW);
    digitalWrite(GLED, LOW);
  }
  else if(20< distance && distance < 30){
    digitalWrite(RLED, LOW);
    digitalWrite(YLED, LOW);
    digitalWrite(BLED, HIGH);
    digitalWrite(GLED, LOW);
  }
  else{
    digitalWrite(RLED, LOW);
    digitalWrite(YLED, LOW);
    digitalWrite(BLED, LOW);
    digitalWrite(GLED, HIGH);
  }
}
