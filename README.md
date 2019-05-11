## MMM-Hotword
MMM-Hotword is a hotword detector using snowboy.
You can use this module to wake another voice assistant or to give a command to other module.

### Screenshot
This works in background, so there is no screenshot.

### UPDATED
**2.0.0 (2019-05-05)**
- Whole new build-up
- Some annoying dependencies are removed.
- Installer is provided. (`installer/install.sh`)
- Personal model trainer is porivded. (`trainer/trainer.sh`)
- Continuous recording after hotword detection is supported (Now you can say like "Computer, volume up" without pausing between `Computer` and `volume up`)
  - This feature could be used with `MMM-AssistantMk2 ver3.x`(Not yet released, but arrive soon)
- Simple standalone commands could be available. (Without any Assistant, you can make own voice commands with this module standalone.)
- More universal models are added. (`computer`, `subex`, `hey extreme` and more.)
- Hotword detected could be displayed on screen of MM.


#### How to update (From previous version 1.X)
> You need to remove old MMM-Hotword directory then re-install from scratch again.

### Installation

```sh
sudo apt update
sudo apt upgrade
sudo apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all

cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-Hotword.git
cd MMM-Hotword
npm install

chmod +x ./installer/install.sh
./installer/install.sh
```

If you can see something with these similar on last part of installation log, Installation would be success
```sh


```



### Configuration
Below values are pre-set as default values. It means, you can put even nothing in config field.
```javascript
{
  module: 'MMM-Hotword',
  config: {
    snowboy: [
  {
    hotwords: "smartmirror", //this will be sent to other module for distinguishing which hotword is detected.
    file: "resources/models/smart_mirror.umdl",
    sensitivity: '0.5',
  },
  {
    hotwords: "snowboy",
    file: "resources/models/snowboy.umdl",
    sensitivity: '0.5',
  },
  {
    file: 'resources/models/jarvis.umdl',
    sensitivity: '0.8,0.80',
    hotwords: ['jarvis','jarvis'] //Kitt.ai changed their Jarvis UMDL, it has 2 models in one file. So weird.
    //anyway, you can give different name for each. ['jarvis_1', 'jarvis_2']. Even though I think this is useless.
  }
    ],
    record: {
      sampleRate    : 16000,      // audio sample rate
      threshold     : 0.5,        // silence threshold (rec only)
      thresholdStart: null,       // silence threshold to start recording, overrides threshold (rec only)
      thresholdEnd  : null,       // silence threshold to end recording, overrides threshold (rec only)
      silence       : 1.0,        // seconds of silence before ending
      verbose       : false,      // log info to the console. Use this when you want to check mic working or not.
      recordProgram : 'arecord',  // Defaults to 'arecord' - also supports 'rec' and 'sox'
      device        : null        // recording device (e.g.: 'plughw:1')
    },
    autostart: true,              // if 'false', this module will wait for 'HOTWORD_RESUME' notification to start hotwords detection at the beginning.
    autorestart: false,          // You can set this 'true' when you want this module to go back to listening mode automatically again after hotword is detected. But use this carefully when your other modules are using microphone or speaker.

    // customizable notification trigger
    notifications: {
      PAUSE: "HOTWORD_PAUSE",
      RESUME: "HOTWORD_RESUME",
      LISTENING : "HOTWORD_LISTENING",
      SLEEPING : "HOTWORD_SLEEPING",
      ERROR : "HOTWORD_ERROR",
    },
    onDetected: {
      notification: (payload) => {
        return "HOTWORD_DETECTED"
      },
      payload: (payload) => {
        return payload
      }
    },
  }
},

```

If you want to use default configuration, just use like this. and it's enough.
(With this empty configuration, you can use 'snowboy', 'smart mirror', 'jarvis' as hotwords.)

```
{
  module: "MMM-Hotword",
  config: {}
},
```

### Usage

#### 1. Commands
Other modules can order this module to start/stop by notifications. All notifications are customizable, but these info will be about default values.

|Notification| payload| description
|---|---|---|
|HOTWORD_RESUME | null | Let this module try to listen sounds until detecting hotwords or interrupted.
|HOTWORD_PAUSE | null | Let this module stop to listen sounds.

#### 2. Results
This module might broadcast some notification as results.

|Notification|payload|description
|---|---|---|
|HOTWORD_ERROR | error | When error is occurred.
|HOTWORD_LISTENING | null | When this module start listening. (normally instant answer for the 'HOTWORD_RESUME')
|HOTWORD_SLEEPING | null | When this module stop listening. (normally instant answer for the 'HOTWORD_PAUSE')
|HOTWORD_DETECTED | {index: `int`, hotword: `string`} | When a hotword is detected, this notification will be casted. <br> In default configuration values;<br>{index:1, hotword:'smartmirror'}<br>{index:2, hotword:'snowboyY'}<br>{index:3, hotword:'jarvis'}<br>{index:4, hotword:'jarvis'}

#### 3. Common usage flow
1. If `autostart` is set as 'true', Your mirror is ready to catch hotwords after the mirror is on. (See 5. for `autostart` is 'false')
2. Say the hotword. (e.g; 'Jarvis' or 'Smart mirror')
3. If detection is success, `HOTWORD_DETECTED`notification will be broadcasted with `{index:n, hotword:'something'}`.
4. Now, you can make your other modules to receive that notification and do something.
5. After `HOTWORD_DETECTED` notification is sent, `MMM-Hotword` stops listening hotword(unless `autorestart` is `true`), so, your other modules should reactivate `MMM-HOTWORD` with `HOTWORD_RESUME` notification. (If your module uses microphone, should release mic for hotword listening before notification)
6. Don't set `autorestart` as 'true' specially when you combine this with other voice(mic) related modules. (But if you have 2 mics, It might be OK.)

### Tip.
- You can use this module with [MMM-AssistantMk2](https://github.com/eouia/MMM-AssistantMk2) to make embeded Google Assistant.
```
//Configuration for working together with `MMM-AssistantMk2 (^2.0.0)`

{
  module: "MMM-Hotword",
  config: {
    record: {
      recordProgram : "arecord",  
      device        : "plughw:1"
    },
    autostart:true,
    onDetected: {
      notification: (payload) => {
        return "ASSISTANT_ACTIVATE"
      },
      payload: (payload) => {
        return {
          profile: payload.hotword
        }
      }
    },
  },
},
```
Then, you need to modify `MMM-AssistantMk2` configuration also.
You need to add this into `config{}` of your `MMM-AssistantMk2`

```
notifications: {
  ASSISTANT_ACTIVATED: "HOTWORD_PAUSE",
  ASSISTANT_DEACTIVATED: "HOTWORD_RESUME",
},
```

### Default Universal models and recommended properties
```js
{
  hotwords: "smart_mirror",
  file: "smart_mirror.umdl",
  sensitivity: "0.5",
},
{
  hotwords: "computer",
  file: "computer.umdl",
  sensitivity: "0.6",
},
{
  hotwords: "snowboy",
  file: "snowboy.umdl",
  sensitivity: "0.5",
},
{
  hotwords: ["jarvis", "jarvis"],
  file: "jarvis.umdl",
  sensitivity: "0.8,0.8",
},
{
  hotwords: "subex",
  file: "subex.umdl",
  sensitivity: "0.6",
},
{
  hotwords: ["neo_ya", "neo_ya"],
  file: "neoya.umdl",
  sensitivity: "0.7,0.7",
},
{
  hotwords: "hey_extreme",
  file: "hey_extreme.umdl",
  sensitivity: "0.6",
},
{
  hotwords: "view_glass",
  file: "view_glass.umdl",
  sensitivity: "0.7",
},
```
When you are using `.pmdl`, set `DetectorApplyFrontend` to `false`.

For `.umdl`, When you use only`snowboy` and `smart_mirror`, `false` is better. But with other models, `true` is better.

### How to make Personal model (.pmdl)
1. Get Snowboy API token. API token can be obtained by logging into https://snowboy.kitt.ai, click on “Profile settings”.

2. go to trainer directory, and modify `trainer.sh`
```sh
nano temp_trainer.sh
```
In the file, you can find where to modify.
```sh
############# MODIFY THE FOLLOWING #############
# Secret user token
TOKEN="put your snowboy API token here"
#String, or “unknown” if we don’t know hotword name
NAME="volume_up"
# ar (Arabic), zh (Chinese), nl (Dutch), en (English), fr (French), dt (German), hi (Hindi), it (Italian), jp (Japanese), ko (Korean), fa (Persian), pl (Polish), pt (Portuguese), ru (Russian), es (Spanish), ot (Other)
LANGUAGE="en"
# 0_9, 10_19, 20_29, 30_39, 40_49, 50_59, 60+
AGE_GROUP="40_49"
# F/M
GENDER="M"
# String, your microphone type
MICROPHONE="PS3 Eye"
############### END OF MODIFY ##################
```

3. Record your hotword 3 times on your RPI (`.pmdl` which is created on other device, might not work)
```sh
rec -r 16000 -c 1 -b 16 -e signed-integer 1.wav
rec -r 16000 -c 1 -b 16 -e signed-integer 2.wav
rec -r 16000 -c 1 -b 16 -e signed-integer 3.wav
```

4. Then, train them
```sh
./temp_trainer.sh 1.wav 2.wav 3.wav volume_up.pmdl
```

5. Move `.pmdl` to `models` directory
```sh
mv volume_up.pmdl ../models/
```

6. Now, make `recipe` or add this to your config
```js
models: [
  {
    hotwords    : "volume_up",
    file        : "volume_up.pmdl",
    sensitivity : "0.5",
  },
],
customCommands: {
  "volume_up" : {
    notificationExec: {
      notification: "VOLUME_UP"
    }
  }
},
```

### UPDATE HISTORY
**1.1.0 (2018-11-4)**
- notification configurable. (You don't need `MMM-NotificationTrigger` any more for using with `MMM-AssistantMk2(^2.0.0)`)
- But if you want more complex action chains, you can still use `MMM-NotificationTrigger` also.



### Last Tested; (2019-05-05)
- MagicMirror : v2.7.1
- Tested Environment :
  - Raspbian Stretch (Raspbian 3B+)
  - TinkerOS (TinkerBoard)
  - Ubuntu 18.04 (NVIDIA Jetson Nano)
  - OSX 10.14.4 (Apple MacBookPro) / node v11.12.0 / npm v6.7.0
