
const path = require('path');
const html2canvas = require('html2canvas');
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
        if(type == 3) {
            txt = document.createTextNode('controller');
            div.appendChild(txt);
        }
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
    html2canvas(document.querySelector("#all")).then(canvas => {
        data = canvas.toDataURL()
        r = sessionStorage.getItem('name')
        dir = Buffer.from(r, 'utf-8').toString('hex')
        fs.writeFile(path.join(__dirname, `../layout/${dir}/preview.txt`), data, 'utf8', (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
                console.log(`File is written successfully!`);
            }
          });
    });
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


function switchState() {
    exporter.all(function (err, all) {
        let bool = Object.values(all.one)[0].value;
        if(bool == 'true') {
            onOff("false")
            setState("false");
        } else {
            onOff("true")
            setState("true");
        }
        
    });
}

function incbright() {
    axios.put('http://localhost:16021/api/v1/VirtualDevToken/state/',{"brightness" : {"increment":10}});
}

function decbright() {
    axios.put('http://localhost:16021/api/v1/VirtualDevToken/state/',{"brightness" : {"increment":-10}});
}

let effs = [];

function next() {
    dur = 0
    if(effs.length==0) {
        db1.each('SELECT effectsList FROM effects',[], function(err,row) {
            eff = Object.values(row);
            effs.push(eff);
        });
    }
    setTimeout(() => {
        if (mod == "effect") {
            clearTimeout(effectTimeout);
            clearInterval(effectInterval);
            removeTrans(Data);
        } 
        if(ty == 'plugin') {
            removeTrans(Data);
            clearPanel(Data);
        }
        db1.get('SELECT * FROM effects WHERE effectsList =?', [effs[0]], (err, row) => {
            let Anim = JSON.parse(row.effectsData);
            if(Anim.animType == "custom" || Anim.animType == "static") {
                animData(Anim,dur);
            } else if (Anim.animType == "solid") {
                setColorMode('*Solid*')
                Solid(Data, dur, Anim.palette)
            } else {
                clearPanel(Data);
                show(Anim,dur);
            }
            db1.run('UPDATE selects SET selects=?', [effs[0]], function(err) {
                if (err) {
                    return console.error('error');
                }
                effs.shift()
            });
        });
        
    }, 100);
}

let effswap = [];

function swap() {
    dur = 0
    if(effswap.length==0) {
        db1.each('SELECT effectsList FROM effects',[], function(err,row) {
            eff = Object.values(row);
            effswap.push(eff);
        });
    }
    setTimeout(() => {
        if (mod == "effect") {
            clearTimeout(effectTimeout);
            clearInterval(effectInterval);
            removeTrans(Data);
        } 
        if(ty == 'plugin') {
            removeTrans(Data);
            clearPanel(Data);
        }
        rand = Math.round(Math.random() * (effswap.length-1))
        db1.get('SELECT * FROM effects WHERE effectsList =?', [effswap[rand]], (err, row) => {
            db1.run('UPDATE selects SET selects=?', [effswap[0]], function(err) {
                if (err) {
                    return console.error('error');
                }
                effswap.shift();
            });
            let Anim = JSON.parse(row.effectsData);
            if(Anim.animType == "custom" || Anim.animType == "static") {
                animData(Anim,dur);
            } else if (Anim.animType == "solid") {
                setColorMode('*Solid*')
                Solid(Data, dur, Anim.palette)
            } else {
                clearPanel(Data);
                show(Anim,dur);
            }

        });
        
    }, 200);
}

let btn = document.querySelector('#power');
let count = 0;
let counter;

btn.addEventListener('click',(event) => {
    if(count>=5) {
        clearInterval(counter)
    } else {
        switchState()
    }
});

btn.addEventListener('mousedown',(event) => {
    count=0;
    counter = setInterval(() => {
        count++
    }, 1000);
    
});

btn.addEventListener('mouseup',(event) => {
    clearInterval(counter)
    if(count>5) {
        auth = true;
        Searching()
        setTimeout(() => {
            auth = false; 
        }, 30000);
    }
});

function Searching() {
    let ani;
    music = document.getElementById('music');
    swape = document.getElementById('swap');
    nexte = document.getElementById('next');
    less = document.getElementById('less');
    more = document.getElementById('more');
    lis = ['music','swape','nexte','less','more']
    let i = 0
    function start() {
        ani = setInterval(() => {
            if(i<=4) {
                eval(lis[i]).style.backgroundColor='white'
                if(i!=0) {
                    eval(lis[i-1]).style.backgroundColor=''
                }
                i++
            } else {
                back()
                i = i - 1
                clearInterval(ani)
            }
        }, 400);
    }
    function back() {
        ani2 = setInterval(() => {
            if(i!=-1) {
                eval(lis[i]).style.backgroundColor='white'
                if(i!=4) {
                    eval(lis[i+1]).style.backgroundColor=''    
                }
                i--
            } else {
                start()
                i = 0
                clearInterval(ani2)
            }
        }, 400);
    }
    start()
    setTimeout(() => {
        clearInterval(ani)
        clearInterval(ani2)
        for(x=0; x < 4 ;x++) {
            eval(lis[x]).style.backgroundColor=''
        }
    }, 30000);
}



//need to finish this anim