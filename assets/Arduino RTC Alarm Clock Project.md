**Arduino RTC Alarm Clock Project – Final Report**



This project began from a simple idea: creating a digital clock that not only displays the time, date, and temperature but also includes alarms, push-button controls, a buzzer, LEDs, and reliable timekeeping using the DS1302 Real-Time Clock (RTC) module. The goal was to build a fully functional system that looks and behaves like a miniature alarm clock, but with custom features we could program ourselves. Over time, the project grew as we improved the code, integrated hardware safely, and ensured the system worked both in real life and within Proteus simulation.



**Components Used**



* Arduino Uno
* DS1302 RTC Module
* 16×2 LCD Display (with potentiometer for contrast)
* Three Push Buttons
* Active Buzzer
* One or more LEDs
* 10kΩ Potentiometer
* Resistors (for buttons and LEDs)
* Connecting wires and breadboard



**Wiring Connections**



| \*\*Component\*\* | \*\*Pin\*\*    | \*\*Arduino Pin\*\*     |

| ------------- | ---------- | ------------------- |

| DS1302        | RST        | D6                  |

| DS1302        | I/O        | D7                  |

| DS1302        | SCLK       | D8                  |

| DS1302        | VCC1       | +5V                 |

| DS1302        | VCC2       | +5V / Battery       |

| DS1302        | GND        | GND                 |

| LCD           | RS         | D12                 |

| LCD           | E          | D11                 |

| LCD           | D4         | D5                  |

| LCD           | D5         | D4                  |

| LCD           | D6         | D3                  |

| LCD           | D7         | D2                  |

| LCD           | VSS        | GND                 |

| LCD           | VDD        | +5V                 |

| LCD           | V0         | Potentiometer       |

| Button 1      | One side   | D9                  |

| Button 2      | One side   | D10                 |

| Button 3      | One side   | D13                 |

| All Buttons   | Other side | GND (via resistors) |

| Buzzer        | +          | D A0                |

| Buzzer        | –          | GND                 |

| LED           | +          | A1                  |

| LED           | –          | GND (via resistor)  |



**How the Project Works**

The DS1302 RTC keeps accurate time and date even when power is disconnected. The Arduino reads this data and displays it on the 16×2 LCD. The buttons allow the user to navigate menus, set alarms, and adjust time or date values. The buzzer activates when the alarm time is reached, and the LED(s) help to visually indicate alarm status or button feedback. The potentiometer controls LCD contrast, ensuring clear visibility of the display.

When the alarm matches the stored time, the system triggers the buzzer and flashes the LED until a button is pressed to stop it.



**Challenges and Solutions**

* One major problem was merging two different codes—one with full date functionality and another with working buzzer, buttons, and LED logic. We solved this by carefully merging libraries, avoiding pin conflicts, and restructuring the time-setting functions.
* Another challenge was Proteus simulation issues, including hidden DS1302 pins and LCD backlight confusion. We overcame this by selecting the correct device variants, adding GND terminals, and using external potentiometers.
* Finally, misunderstanding the Proteus potentiometer and DS1302 wiring led to multiple trial-and-error steps, but testing both in real hardware and simulation clarified the proper wiring.
