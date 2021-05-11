
const path = require('path');

// Data = {"numPanels":24,"sideLength":0,"positionData":[{"panelId":4836,"x":100,"y":0,"o":0,"shapeType":3},{"panelId":47034,"x":0,"y":0,"o":270,"shapeType":2},{"panelId":49366,"x":100,"y":100,"o":0,"shapeType":2},{"panelId":63008,"x":0,"y":100,"o":0,"shapeType":2},{"panelId":7251,"x":199,"y":100,"o":270,"shapeType":2},{"panelId":50041,"x":200,"y":199,"o":270,"shapeType":2},{"panelId":7623,"x":100,"y":200,"o":270,"shapeType":2},{"panelId":23951,"x":0,"y":200,"o":360,"shapeType":2},{"panelId":11954,"x":200,"y":299,"o":270,"shapeType":2},{"panelId":45023,"x":100,"y":300,"o":270,"shapeType":2},{"panelId":49565,"x":0,"y":300,"o":360,"shapeType":2},{"panelId":15094,"x":300,"y":199,"o":270,"shapeType":2},{"panelId":46620,"x":300,"y":299,"o":540,"shapeType":2},{"panelId":21537,"x":400,"y":299,"o":810,"shapeType":2},{"panelId":5680,"x":500,"y":299,"o":810,"shapeType":2},{"panelId":52037,"x":399,"y":199,"o":810,"shapeType":2},{"panelId":26670,"x":299,"y":99,"o":270,"shapeType":2},{"panelId":15356,"x":399,"y":99,"o":360,"shapeType":2},{"panelId":57518,"x":200,"y":0,"o":0,"shapeType":2},{"panelId":1198,"x":300,"y":0,"o":0,"shapeType":2},{"panelId":16193,"x":400,"y":0,"o":0,"shapeType":2},{"panelId":50502,"x":500,"y":0,"o":0,"shapeType":2},{"panelId":41153,"x":500,"y":100,"o":0,"shapeType":2},{"panelId":6777,"x":500,"y":200,"o":90,"shapeType":2}]}
const fs = require('fs'); 
input = JSON.parse(fs.readFileSync(path.join(__dirname, '../customPanel.json'), 'utf8'));
Data = {"numPanels":input[0],"sideLength":input[1],"positionData":input[2]}
var tinycolor = require("tinycolor2");

function createPanel(list) {
    positionData = list.positionData
    for (let i in positionData) {
        id = positionData[i].panelId;
        x = positionData[i].x;
        y = positionData[i].y;
        // o = positionData[i].o;
        type = positionData[i].shapeType;
        div = document.createElement('div'); 
        div.className = 'panel cover';
        div.id = 'id_'+id
        //show panel id in render
        // txt = document.createTextNode(id);
        // div.appendChild(txt);
        document.getElementById("frame").appendChild(div);
        panel = document.getElementById('id_'+id);
        panel.style.position = "absolute";
        panel.style.left = x + 'px';
        panel.style.bottom = y + 'px';
    }
}

function off(list) {
    clearTimeout(effectTimeout)
    clearInterval(effectInterval)
    removeTrans(list)
    clearPanel(list)
    positionData = list.positionData
    for (let i in positionData) {
        id = positionData[i].panelId;
        panel = document.getElementById('id_'+id);
        panel.style.backgroundColor='#dadee1'
    }
}

function rotate(deg) {
    panel = document.getElementById('frame');
    panel.style.transform = "rotate("+deg+"deg)"
}

function brightness(list, val, dur=0) {
    setTimeout(() => {
        positionData = list.positionData
        for (let i in positionData) {
            id = positionData[i].panelId;
            panel = document.getElementById('id_'+id);
            panel.style.filter = 'brightness('+val+'%)'
        }  
    }, dur*1000);
}

function identify(list) {
    positionData = list.positionData
    inter = setInterval(() => {
        for (let i in positionData) {
            id = positionData[i].panelId;
            panel = document.getElementById('id_'+id);
            panel.style.backgroundColor='white'
        }
        setTimeout(() => {
            for (let i in positionData) {
                id = positionData[i].panelId;
                panel = document.getElementById('id_'+id);
                panel.style.backgroundColor='#dadee1'
            }
        }, 500);
    }, 1000);
    setTimeout(() => {
        clearInterval(inter)
        inter2 = setInterval(() => {
            for (let i in positionData) {
                id = positionData[i].panelId;
                panel = document.getElementById('id_'+id);
                type = positionData[i].shapeType;
                if (type == '3') {
                    panel.style.backgroundColor='white'
                }
            }
            setTimeout(() => {
                for (let i in positionData) {
                    id = positionData[i].panelId;
                    type = positionData[i].shapeType;
                    panel = document.getElementById('id_'+id);
                    if (type == '3') {
                        panel.style.backgroundColor='#dadee1'
                    }
                }
            }, 500);
        }, 1000);
        setTimeout(() => {
            clearInterval(inter2)
        }, 2000);
    }, 2000);
    //white black,white black
    //CONTROLER white black, white black
}

function hsl(list, hue, sat, bright=50) {
    positionData = list.positionData
    for (let i in positionData) {
        id = positionData[i].panelId;
        panel = document.getElementById('id_'+id);
        panel.style.backgroundColor = "hsl("+hue+","+sat+"%,"+bright+"%)";
    }
}

function removeTrans(list) {
    positionData = list.positionData
    for (let i in positionData) {
        id = positionData[i].panelId;
        panel = document.getElementById('id_'+id);
        panel.style.removeProperty("transition")
    }
}

function clearPanel(list) {
    positionData = list.positionData
    for (let i in positionData) {
        id = positionData[i].panelId;
        panel = document.getElementById('id_'+id);
        panel.style.backgroundColor = 'black'
    }
}

function show(json, dur=0) {
    if(json.animType == 'plugin') {
        if(effectInterval != undefined) {
            clearInterval(effectInterval)
            clearTimeout(effectTimeout)
            removeTrans(Data)
        }
        switch (json.pluginUuid) {
            case '6970681a-20b5-4c5e-8813-bdaebc4ee4fa':
                break;
            case '027842e4-e1d6-4a4c-a731-be74a1ebd4cf':
                break;
            case '713518c1-d560-47db-8991-de780af71d1e':
                break;
            case 'b3fd723a-aae8-4c99-bf2b-087159e0ef53':
                break;
            case 'ba632d3e-9c2b-4413-a965-510c839b3f71':
                Random(json,dur)
                break;
            case '70b7c636-6bf8-491f-89c1-f4103508d642':
                Highlight(json,dur)
                break;
        }
    }
}

function Solid(list, time, color) {
    convert = tinycolor({h: color[0].hue, s: color[0].saturation, v: color[0].brightness}).toHsl()
    hsl(list,convert.h, convert.s*100, convert.l*100)
    if(time != 0) {
        setTimeout(() => {
            latest()
        }, time*1000);
    }
}
