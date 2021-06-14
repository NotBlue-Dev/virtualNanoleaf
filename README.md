# NanoVirtz

NanoVirtz is an Nanoleaf Emulator allowing you to do api request like on real device and see the rendering in real time, so you can test your external scripts for nanoleafs on different layout

## Installation

Download the installer here https://github.com/NotBlue-Dev/virtualNanoleaf/releases

## Use custom layout

Just click create a new layout on the menu or choose a default one

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
- External Control (UDP) but animData are implemented
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

Renderer
![Capture](https://user-images.githubusercontent.com/64601123/118158043-31ee2100-b413-11eb-9b3b-f861b726eced.PNG)
Layout Editor
![Capture](https://user-images.githubusercontent.com/64601123/121945384-92b99380-cd08-11eb-9968-7029b741d8c1.PNG)
New Menu
![2](https://user-images.githubusercontent.com/64601123/121945388-93522a00-cd08-11eb-8502-eb17bec82e02.PNG)

## Know issue
- SSDP Search show more than 1 virtual nanoleaf
- Some transitions are glitchy (colors appear from the last effects)

## License
[MIT](LICENSE)
