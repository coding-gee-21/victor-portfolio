# Sound Sensor Integrated Snake lights

It started with an idea a friend of mine gave. He wanted to understand the code sequence embedded in snake lights. So we went and did a little research  after which we decided to create a home made version of the snake lights using normal led(s) and an Arduino micro-controller. Once we finished that project, I posted it on my WhatsApp status. Another friend saw the video and gave me the idea of integrating it with a sound sensor allowing the LED(S) to blink to the pattern of the sound waves.



#### Parts used in the project were;

* 8 LED(S) - (YELLOW, GREEN, BLUE AND RED)\*2
* An RGB module - 1PC
* Resistors - 8
* Sound sensor (KY-037 module) - 1
* Jumper wires
* IR RECEIVER -  1
* Remote controller.
* Breadboard



#### Wiring

| Component                       | Arduino Pin    |

| ------------------------------- | -------------- |

| IR Receiver OUT                 | D2             |

| LEDs (Red, Yellow, Green, Blue) | D3, D4, D5, D6 |

| Sound Sensor A0                 | A0             |

| Sound Sensor D0                 | D11            |

| +                               | 5V             |

| G                               | GND            |





#### Working

The project has two modes, that is; The **normal snake lights system** and the **sound sensor integrated LED system.** The normal snake lights system is just that, a mode that turns on when the on button present on the IR controller is pressed. It has four functions; Flash, strobe fade and smooth which control different flickering of the LED(s) when their respective buttons are pressed. 

The sound sensor integrated LED system mode is only accessible when the IR controller on button isn't pressed, that is, when then normal snake lights mode is turned off.

A KY-O37 module makes the LED(S) blink to the pattern of beats when the sensor is exposed to sounds of specific threshold.

| Button                     | Effect                                   |

| -------------------------- | ---------------------------------------- |

| \*\*ON\*\*                     | Enables IR control                       |

| \*\*OFF\*\*                    | Stops IR mode, returns to sound-reactive |

| \*\*FLASH\*\*                  | Classic chasing pattern                  |

| \*\*STROBE\*\*                 | Fast blinking of all LEDs                |

| \*\*FADE\*\*                   | Smooth fading brightness                 |

| \*\*SMOOTH\*\*                 | Slow snake movement                      |

| \*\*RED\*\*                    | Only Red LED lights                      |

| \*\*GREEN\*\*                  | Only Green LED lights                    |

| \*\*BLUE\*\*                   | Only Blue LED lights                     |

| \*\*YELLOW\*\*                 | Mix of Red + Yellow                      |

| \*\*WHITE\*\*                  | All LEDs ON (bright white mix)           |

| \*\*Idle (no remote input)\*\* | LEDs flash to music beat                 |





#### Problems I experienced when creating the project.

I only experienced some mild problems when generating the code. Chat GPT kept giving codes that made the project work in a way I didn't intend it to. For example; The first code that it gave me made the sound sensor too sensitive to environmental sounds making the LED(s) blink constantly. I tried solving the problem mechanically by turning the potentiometer present on the sound sensor but the sensor was still too sensitive. I then switched to changing the software by increasing the threshold of the sound sensor to 150. Once I did that, the project worked perfectly as intended.



#### FUTURE EXPECTATIONS FOR THE PROJECT

I plan to make this project even better by designing a PCB for it instead of using a breadboard  even though the project worked just as well as it would with the breadboard. This will give the project a more professional outlook. I also plan to replace the LED(s) with an LED strip and connect the PCB to a working sound system to make it more entertaining. 



#### 





