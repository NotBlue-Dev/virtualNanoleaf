# NanoVirtz

NanoVirtz is an Nanoleaf Emulator allowing you to do api request like on real device and see the rendering in real time, so you can test your external scripts for nanoleafs on different layout

## Installation

Download the installer here https://github.com/NotBlue-Dev/virtualNanoleaf/releases

## Use custom layout

for the moment I have not implemented a layout editor therefore you must have an existing layout and format it as follows:
```text
[numberOfPanel,sideLength,[positionData]]
```
Eg:
```json
[9,0,[{"panelId":33367,"x":300,"y":100,"o":0,"shapeType":3},{"panelId":21896,"x":200,"y":100,"o":270,"shapeType":2},{"panelId":26596,"x":300,"y":200,"o":0,"shapeType":2},{"panelId":25586,"x":200,"y":200,"o":270,"shapeType":2},{"panelId":48228,"x":100,"y":200,"o":360,"shapeType":2},{"panelId":28795,"x":100,"y":300,"o":450,"shapeType":2},{"panelId":32792,"x":0,"y":300,"o":540,"shapeType":2},{"panelId":17663,"x":100,"y":400,"o":450,"shapeType":2},{"panelId":40130,"x":200,"y":300,"o":540,"shapeType":2}]]
```
There is default layout in file ```basicLayout```

To change layout, just copy and paste the json like above in ```ressources/app/customPanel.json```

## How to request the api
the requests are made like the official api, except that instead of putting the ip of your device, you must put ```localhost```
Eg (create new token):
```json
http://localhost:16021/api/v1/new
```
There is a default token if you face issue :
```json
VirtualDevToken
```

## Api difference
This project is a recreation of the api, therefore some functions are not implemented, here is the list:
- External Control
- Rythm
- Event
- mDNS discovery

Finaly, I didn't like my implementation of some of the effects, so I decided to redo them, therefore the effects are missing:
- Flow
- Wheel
- Fade 
- Explode

Only these one are implemented:
- Random
- Highlight
- Custom Anim Data

I'm doing my best to reimplement the missing effects, some will come in the next update.

## How it look
![Capture](https://user-images.githubusercontent.com/64601123/118158043-31ee2100-b413-11eb-9b3b-f861b726eced.PNG)


## Know issue
- SSDP Search show more than 1 virtual nanoleaf
- Force refresh the app will cause it to broke
- Can't run two instace of the app at the same time
- Some transitions are glitchy (colors appear from the last effects)

## License
[MIT](LICENSE)
