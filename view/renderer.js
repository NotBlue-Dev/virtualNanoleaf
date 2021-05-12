
const path = require('path');
let ypos = [];
let xpos = [];
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
        xpos.push(Math.ceil(x/100)*100);
        ypos.push(Math.ceil(y/100)*100);
        type = positionData[i].shapeType;
        div = document.createElement('div'); 
        div.className = 'panel cover';
        div.id = 'id_'+id;
        //show panel id in render
        txt = document.createTextNode(id);
        div.appendChild(txt);
        document.getElementById("container").appendChild(div);
        panel = document.getElementById('id_'+id);
        panel.style.position = "absolute";
        panel.style.left = x + 'px';
        panel.style.bottom = y + 'px';
    }
    container = document.getElementById('container');
    high = Math.max(...xpos).toString()
    if(high.length>3) {
        if(high.split('0')[0].length>=2) {
            end = high.split('0')[0]
        } else {
            end = high.split('0')[0] + "0"
        }
    } else {
        end = high.split('0')[0]
    }
    container.style.width = Number(end)+1+"00px"
    
    height = Math.max(...ypos).toString()
    if(height.length>3) {
        if(height.split('0')[0].length>=2) {
            yheight = height.split('0')[0]
        } else {
            yheight = height.split('0')[0] + "0"
        }
    } else {
        yheight = height.split('0')[0]
    }
    container.style.height = Number(yheight)+1+"00px"
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
    panel = document.getElementById('container');
    panel.style.transform = "rotate("+deg+"deg)"
    // container = document.getElementById('container');
    // console.log(deg == 0)
    // if (deg != 0) {
    //     high = Math.max(...ypos).toString()
    //     if(high.length>3) {
    //         if(high.split('0')[0].length>=2) {
    //             end = high.split('0')[0]
    //         } else {
    //             end = high.split('0')[0] + "0"
    //         }
    //     } else {
    //         end = high.split('0')[0]
    //     }
    //     container.style.height = Number(end)+1+"00px"
    // } else {
    //     container.style.height = null;
    // }
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
