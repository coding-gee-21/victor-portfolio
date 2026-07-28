#include <LiquidCrystal.h>
#include <ThreeWire.h>
#include <RtcDS1302.h>

// ---- LCD (RS, EN, D4, D5, D6, D7)
LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

// ---- DS1302 RTC pins
const int PIN_RST = 10;
const int PIN_DAT = 9;
const int PIN_CLK = 8;

ThreeWire myWire(PIN_DAT, PIN_CLK, PIN_RST);
RtcDS1302<ThreeWire> Rtc(myWire);

// ---- Buttons
const int btnMode = A0;
const int btnUp   = A1;
const int btnDown = A2;

// ---- Buzzer & LEDs
const int buzzerPin = 11;
const int ledAlarm  = 12;
const int ledTimer  = 13;
const int ledStop   = A3;

// ---- Days of week
const char* daysOfWeek[7] = {
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
};

// ---- Variables
int mode = 0; // 0=Clock, 1=Alarm, 2=Timer, 3=Stopwatch
bool colonState = true;
unsigned long lastBlink = 0;
bool is12Hour = false;

// ---- Alarm
int alarmHour = 6;
int alarmMinute = 0;
bool alarmEnabled = false;
bool alarmRinging = false;

// ---- Timer
int timerMinutes = 1;
int timerSeconds = 0;
bool timerRunning = false;
unsigned long lastTimerTick = 0;

// ---- Stopwatch
int swMinutes = 0, swSeconds = 0;
bool swRunning = false;
unsigned long lastSWtick = 0;

void setup() {
  lcd.begin(16, 2);
  pinMode(btnMode, INPUT_PULLUP);
  pinMode(btnUp, INPUT_PULLUP);
  pinMode(btnDown, INPUT_PULLUP);

  pinMode(buzzerPin, OUTPUT);
  pinMode(ledAlarm, OUTPUT);
  pinMode(ledTimer, OUTPUT);
  pinMode(ledStop, OUTPUT);

  Rtc.Begin();

  lcd.print("Digital Clock");
  delay(1500);
  lcd.clear();
}

void loop() {
  handleModeButton();

  switch (mode) {
    case 0: showClock();     break;
    case 1: showAlarm();     break;
    case 2: showTimer();     break;
    case 3: showStopwatch(); break;
  }
}

// ---- Handle Mode Button (short = mode switch, long = 12/24h toggle)
void handleModeButton() {
  static bool lastState = HIGH;
  static unsigned long pressedTime = 0;

  bool reading = digitalRead(btnMode);

  if (lastState == HIGH && reading == LOW) {
    pressedTime = millis();
  }
  if (lastState == LOW && reading == HIGH) {
    unsigned long pressDuration = millis() - pressedTime;
    if (pressDuration < 800) {
      mode = (mode + 1) % 4;
      lcd.clear();
    } else {
      is12Hour = !is12Hour;
      lcd.clear();
    }
  }
  lastState = reading;
}

// ---- CLOCK (Mode 0): time on line1, weekday + date on line2 ----
void showClock() {
  RtcDateTime now = Rtc.GetDateTime();

  // blink colon every 500 ms
  if (millis() - lastBlink > 500) {
    colonState = !colonState;
    lastBlink = millis();
  }

  // --- Line 1: Time with blinking colon and optional AM/PM ---
  int displayHour = now.Hour();
  String ampm = "";
  if (is12Hour) {
    if (displayHour == 0) { displayHour = 12; ampm = "AM"; }
    else if (displayHour < 12) { ampm = "AM"; }
    else if (displayHour == 12) { ampm = "PM"; }
    else { displayHour -= 12; ampm = "PM"; }
  }

  lcd.setCursor(0, 0);
  // Build time string without clearing whole LCD to reduce flicker
  print2digits(displayHour);
  lcd.print(colonState ? ":" : " ");
  print2digits(now.Minute());
  lcd.print(colonState ? ":" : " ");
  print2digits(now.Second());

  // Print AM/PM at right if 12-hour mode
  if (is12Hour) {
    lcd.setCursor(12, 0);
    lcd.print("   "); // clear area
    lcd.setCursor(12, 0);
    lcd.print(ampm);
  } else {
    // if 24h, clear AM/PM area
    lcd.setCursor(12, 0);
    lcd.print("   ");
  }

  // --- Line 2: Weekday + DD/MM/YYYY ---
  lcd.setCursor(0, 1);
  lcd.print(daysOfWeek[now.DayOfWeek()]);
  lcd.print(" ");
  print2digits(now.Day());
  lcd.print("/");
  print2digits(now.Month());
  lcd.print("/");
  lcd.print(now.Year());
}

// ---- ALARM (Mode 1) ----
void showAlarm() {
  lcd.setCursor(0, 0);
  lcd.print("Set Alarm      ");

  lcd.setCursor(0, 1);
  print2digits(alarmHour);
  lcd.print(":");
  print2digits(alarmMinute);
  lcd.print(alarmEnabled ? " ON " : " OFF");

  handleAlarmButtons();
  checkAlarm();
}

void handleAlarmButtons() {
  static bool lastUp = HIGH;
  static unsigned long upPressTime = 0;
  static bool lastDown = HIGH;

  bool upReading = digitalRead(btnUp);
  bool downReading = digitalRead(btnDown);

  // UP button: short -> inc hour, long -> toggle enabled
  if (lastUp == HIGH && upReading == LOW) upPressTime = millis();
  if (lastUp == LOW && upReading == HIGH) {
    unsigned long pressDuration = millis() - upPressTime;
    if (pressDuration < 800) alarmHour = (alarmHour + 1) % 24;
    else alarmEnabled = !alarmEnabled;
    lcd.clear();
  }
  lastUp = upReading;

  // DOWN button: short -> inc minute
  if (lastDown == HIGH && downReading == LOW) {
    alarmMinute = (alarmMinute + 1) % 60;
    lcd.clear();
  }
  lastDown = downReading;
}

void checkAlarm() {
  RtcDateTime now = Rtc.GetDateTime();

  if (alarmEnabled && !alarmRinging &&
      now.Hour() == alarmHour && now.Minute() == alarmMinute && now.Second() == 0) {
    alarmRinging = true;
    digitalWrite(ledAlarm, HIGH);
    tone(buzzerPin, 1000); // continuous tone until stopped
  }

  // Stop alarm by pressing MODE (short press)
  if (alarmRinging && digitalRead(btnMode) == LOW) {
    alarmRinging = false;
    digitalWrite(ledAlarm, LOW);
    noTone(buzzerPin);
    // small debounce to avoid immediate re-trigger
    delay(200);
  }
}

// ---- TIMER (Mode 2) ----
void showTimer() {
  lcd.setCursor(0, 0);
  lcd.print("Timer Mode     ");

  lcd.setCursor(0, 1);
  print2digits(timerMinutes);
  lcd.print(":");
  print2digits(timerSeconds);
  lcd.print(timerRunning ? " RUN" : " SET");

  handleTimerButtons();
  runTimer();
}

void handleTimerButtons() {
  static bool lastUp = HIGH, lastDown = HIGH;
  static unsigned long upPressTime = 0;

  bool upReading = digitalRead(btnUp);
  bool downReading = digitalRead(btnDown);

  // UP button: short -> inc minutes, long -> start/stop
  if (lastUp == HIGH && upReading == LOW) upPressTime = millis();
  if (lastUp == LOW && upReading == HIGH) {
    unsigned long pressDuration = millis() - upPressTime;
    if (pressDuration < 800) timerMinutes = (timerMinutes + 1) % 100;
    else {
      timerRunning = !timerRunning;
      if (timerRunning) {
        lastTimerTick = millis();
      }
    }
    lcd.clear();
  }
  lastUp = upReading;

  // DOWN button: short -> dec minutes (only when not running)
  if (lastDown == HIGH && downReading == LOW && !timerRunning) {
    if (timerMinutes > 0) timerMinutes--;
    lcd.clear();
  }
  lastDown = downReading;
}

void runTimer() {
  if (timerRunning && millis() - lastTimerTick >= 1000) {
    lastTimerTick = millis();
    if (timerSeconds > 0) timerSeconds--;
    else if (timerMinutes > 0) {
      timerMinutes--;
      timerSeconds = 59;
    } else {
      timerRunning = false;
      digitalWrite(ledTimer, HIGH);
      tone(buzzerPin, 2000); // alert
      delay(2000);
      digitalWrite(ledTimer, LOW);
      noTone(buzzerPin);
    }
  }
}

// ---- STOPWATCH (Mode 3) ----
void showStopwatch() {
  lcd.setCursor(0, 0);
  lcd.print("Stopwatch Mode ");

  lcd.setCursor(0, 1);
  print2digits(swMinutes);
  lcd.print(":");
  print2digits(swSeconds);
  lcd.print(swRunning ? " RUN" : " OFF");

  handleSWButtons();
  runStopwatch();
}

void handleSWButtons() {
  static bool lastUp = HIGH, lastDown = HIGH;
  static unsigned long upPressTime = 0, downPressTime = 0;

  bool upReading = digitalRead(btnUp);
  bool downReading = digitalRead(btnDown);

  // UP button start/stop (long press)
  if (lastUp == HIGH && upReading == LOW) upPressTime = millis();
  if (lastUp == LOW && upReading == HIGH) {
    unsigned long pressDuration = millis() - upPressTime;
    if (pressDuration > 800) {
      swRunning = !swRunning;
      // buzzer feedback on start/stop
      if (swRunning) tone(buzzerPin, 1500, 200); // start beep
      else tone(buzzerPin, 1000, 300); // stop beep
    }
    lcd.clear();
  }
  lastUp = upReading;

  // DOWN button reset (long press)
  if (lastDown == HIGH && downReading == LOW) downPressTime = millis();
  if (lastDown == LOW && downReading == HIGH) {
    unsigned long pressDuration = millis() - downPressTime;
    if (pressDuration > 800) {
      swMinutes = 0;
      swSeconds = 0;
      swRunning = false;
      digitalWrite(ledStop, LOW);
      tone(buzzerPin, 500, 500); // reset beep
      lcd.clear();
    }
  }
  lastDown = downReading;
}

void runStopwatch() {
  if (swRunning && millis() - lastSWtick >= 1000) {
    lastSWtick = millis();
    swSeconds++;
    if (swSeconds >= 60) {
      swSeconds = 0;
      swMinutes++;
    }
    digitalWrite(ledStop, HIGH);
  } else if (!swRunning) {
    digitalWrite(ledStop, LOW);
  }
}

// ---- Utility
void print2digits(int num) {
  if (num < 10) lcd.print("0");
  lcd.print(num);
}
