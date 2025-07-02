#include <LiquidCrystal_I2C.h>

#include <Wire.h>


LiquidCrystal_I2C lcd(0x27, 16, 2);

#define NUM_PINS 4
int ledPins[NUM_PINS] = {12, 11, 10, 9};
int buttonPins[NUM_PINS] = {7, 6, 5, 4};
byte level = 1;
byte buzzerPin = 3;
int sequence[10];
int playerInput[10];

void setup() {
  Serial.begin(9600);
  // Wire.begin();
  // for (byte address = 1; address < 127; address++) {
  //   Wire.beginTransmission(address);
  //   if(Wire.endTransmission() == 0) {
  //     Serial.print("I2c device found at addresss: 0x");
  //     Serial.println(address, HEX);
  //   }
  // }









  pinMode(A5, OUTPUT);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("starting game...");
	analogWrite(A5, 255);
  pinMode(buzzerPin, OUTPUT);
  randomSeed(analogRead(0));
  for (int i = 0; i < NUM_PINS; i++) {
  	pinMode(ledPins[i], OUTPUT);
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  genarateSequence();
  delay(3000);
}

void loop() {
  lightUp(level);
  if (!getPlayerInput(level)) {
   	gameOver(); 
  } else {
   	level++;
    lcd.clear();
    lcd.print("level ");
    lcd.print(level);
    genarateSequence();
    delay(500);
  }
  
}
void genarateSequence() {
  for (int i = 0; i < 10; i++) {
    sequence[i] = random(NUM_PINS);
    Serial.print(sequence[i]);
  }
  
}
                            
void lightUp(int round) {
  Serial.println("light up");
  for (int i = 0; i < round; i++) {
    digitalWrite(ledPins[sequence[i]], HIGH);
      delay(500);
    digitalWrite(ledPins[sequence[i]], LOW);
    delay(500);
  }
}

bool getPlayerInput(int round) {
    Serial.println("press get user input");
  for (int i = 0; i < round; i++) {
  	bool pressed = false;
    while(!pressed) {
      for (int j = 0; j < NUM_PINS; j++) {
        
        if (digitalRead(buttonPins[j]) == LOW) {
          
          delay(50);
          digitalWrite(buzzerPin, HIGH);
        if (digitalRead(buttonPins[j]) == LOW) {
            delay(50);
          digitalWrite(buzzerPin, LOW);
          playerInput[i] = j;
          pressed = true;
          lcd.setCursor(0, 1);
          lcd.print("correct");
          Serial.print("player inpunt ");
      		Serial.println(playerInput[i]);
          delay(300);
        }
        }
      }
    }
    if (playerInput[i] != sequence[i]) {
      Serial.println("pressed falsed\nplayer inpunt");
      Serial.println(playerInput[i]);
      return false;
    }
  }
    return true;
}
void gameOver() {
  lcd.clear();
	Serial.println("game Over!!");
  lcd.print("Game Over");
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < NUM_PINS; j++) {
      digitalWrite(ledPins[j], HIGH);
      digitalWrite(buzzerPin, HIGH);
      delay(50);
        
    }
    delay(100);
    for (int j = 0; j < NUM_PINS; j++) {
      digitalWrite(ledPins[j], LOW);
      delay(50);
      digitalWrite(buzzerPin, LOW);
    }
        delay(100);
    level = 1;
    lcd.clear();
    genarateSequence();
  }
    lcd.print("starting game...");
      delay(2000);
}                      
                            
                            
                            
                            
                            
                            