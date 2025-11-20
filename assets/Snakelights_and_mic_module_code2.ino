#include <IRremote.hpp>

// === Pin Setup ===
const int RECV_PIN = 2;
const int redLED = 3;
const int yellowLED = 4;
const int greenLED = 5;
const int blueLED = 6;
const int leds[] = {redLED, yellowLED, greenLED, blueLED};
const int numLeds = 4;

// === Sound Sensor Pins ===
const int soundAnalog = A0;  // Analog sound level (0–1023)
const int soundDigital = 11; // Optional beat pulse (unused here)

// === Remote Codes (from your verified set) ===
#define REMOTE_ADDRESS 0x0
#define CMD_ON     0x45
#define CMD_OFF    0x46
#define CMD_RED    0x47
#define CMD_GREEN  0x44
#define CMD_BLUE   0x40
#define CMD_YELLOW 0x43
#define CMD_WHITE  0x07
#define CMD_FLASH  0x15
#define CMD_STROBE 0x09
#define CMD_FADE   0x16
#define CMD_SMOOTH 0x19

// === Control Variables ===
bool systemOn = false;    // false = sound-reactive mode, true = snake lights
int currentMode = 1;      // Default snake pattern mode
unsigned long lastTrigger = 0;  // Timing for sound pulses

void setup() {
  Serial.begin(115200);
  IrReceiver.begin(RECV_PIN, ENABLE_LED_FEEDBACK);

  pinMode(soundAnalog, INPUT);
  pinMode(soundDigital, INPUT);

  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
    digitalWrite(leds[i], LOW);
  }

  Serial.println("🎵 Snake Lights + Sound Reactive System Ready!");
  Serial.println("▶ Default: Sound reactive mode. Press ON to enter snake lights mode.");
}

void loop() {
  // --- IR Remote Processing ---
  if (IrReceiver.decode()) {
    if (IrReceiver.decodedIRData.address == REMOTE_ADDRESS && IrReceiver.decodedIRData.flags == 0) {
      uint8_t cmd = IrReceiver.decodedIRData.command;
      Serial.print("Command: 0x");
      Serial.println(cmd, HEX);

      switch (cmd) {
       case CMD_ON:
          systemOn = true;
          break;

        case CMD_OFF:
          systemOn = false;
          turnOffLeds();
          break;

        case CMD_RED:
          showSingleColor(redLED);
          break;

        case CMD_GREEN:
          showSingleColor(greenLED);
          break;

        case CMD_BLUE:
          showSingleColor(blueLED);
          break;

        case CMD_YELLOW:
          showSingleColor(yellowLED);
          break;

        case CMD_WHITE:
          showWhite();  // Simulated white light
          break;

        case CMD_FLASH:
          currentMode = 1;
          break;

        case CMD_STROBE:
          currentMode = 2;
          break;

        case CMD_FADE:
          currentMode = 3;
          break;

        case CMD_SMOOTH:
          currentMode = 4;
          break;
      }
    }
    IrReceiver.resume();
  }

  // --- Behavior Switch ---
  if (systemOn) {
    runSnakeLights();  // IR-controlled sequence
  } else {
    runSoundReactive(); // Music-reactive pattern
  }
}

// === Snake Light Patterns ===
void runSnakeLights() {
  switch (currentMode) {
    case 1: flashPattern(); break;
    case 2: strobePattern(); break;
    case 3: fadePattern(); break;
    case 4: smoothPattern(); break;
  }
}

void flashPattern() {
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    delay(150);
    digitalWrite(leds[i], LOW);
  }
}

void strobePattern() {
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    delay(80);
    digitalWrite(leds[i], LOW);
    delay(80);
  }
}

void fadePattern() {
  for (int i = 0; i < numLeds; i++) {
    for (int brightness = 0; brightness <= 255; brightness += 15) {
      analogWrite(leds[i], brightness);
      delay(10);
    }
    for (int brightness = 255; brightness >= 0; brightness -= 15) {
      analogWrite(leds[i], brightness);
      delay(10);
    }
  }
}

void smoothPattern() {
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    delay(200);
    digitalWrite(leds[i], LOW);
  }
}

// === Sound Reactive Mode (with threshold) ===
void runSoundReactive() {
  int soundLevel = analogRead(soundAnalog);  // 0–1023
  int threshold = 150;                       // Ignore anything below this level

  if (soundLevel > threshold && millis() - lastTrigger > 100) {
    lastTrigger = millis();

    // Flash a random LED when loud beat is detected
    int ledIndex = random(0, numLeds);
    digitalWrite(leds[ledIndex], HIGH);
    delay(60);
    digitalWrite(leds[ledIndex], LOW);
  }

  // Smooth brightness pulse according to sound intensity
  int brightness = map(soundLevel, 0, 1023, 0, 255);
  brightness = constrain(brightness, 0, 255);
  for (int i = 0; i < numLeds; i++) {
    analogWrite(leds[i], brightness / 3);
  }
}

// === Helper Function ===
void turnOffLeds() {
  for (int i = 0; i < numLeds; i++) digitalWrite(leds[i], LOW);
}

void showSingleColor(int ledPin) {
  turnOffLeds();
  digitalWrite(ledPin, HIGH);
}

void showWhite() {
  turnOffLeds();
  digitalWrite(redLED, HIGH);
  digitalWrite(greenLED, HIGH);
  digitalWrite(blueLED, HIGH);
}
