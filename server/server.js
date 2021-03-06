
let bodyParser = require('body-parser');
const express = require("express");
const axios = require('axios');

const app = express();

//PROBLEME QUI CAUSE CRASH
const db1 = require('../server/database.js');


const SqliteToJson = require('sqlite-to-json');
const exporter = new SqliteToJson({
    client: db1
});


// Create express app
//var
let ty;
let auth = false;
let mod;
pluginLegacy = ["6970681a-20b5-4c5e-8813-bdaebc4ee4fa","027842e4-e1d6-4a4c-a731-be74a1ebd4cf","713518c1-d560-47db-8991-de780af71d1e","b3fd723a-aae8-4c99-bf2b-087159e0ef53","ba632d3e-9c2b-4413-a965-510c839b3f71","70b7c636-6bf8-491f-89c1-f4103508d642"];
input = JSON.parse(fs.readFileSync(path.join(__dirname, '../customPanel.json'), 'utf8'));
Data = {"numPanels":input[0],"sideLength":input[1],"positionData":input[2]};


//App
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//create token
let news = require('../server/routes/new.js');
app.use('/', news)

//delete token
let deletes = require('../server/routes/delete.js');
app.use('/', deletes)

//get info all
let infos = require('../server/routes/allInfo.js');
app.use('/', infos)

//default
let def = require('../server/routes/default.js');
app.use('/', def)

//get onOff
let onOffs = require('../server/routes/onOff.js');
app.use('/', onOffs)

//get state
let states = require('../server/routes/state.js');
app.use('/', states)

//get globalOrientation
let globalOrientations = require('../server/routes/globalOrientation.js');
app.use('/', globalOrientations)

//put effects
let effects = require('../server/routes/effect.js');
app.use('/', effects)

//identify
let iden = require('../server/routes/identify.js');
app.use('/', iden)

//put globalOrientation
let glOrienPut = require('../server/routes/putGlobal.js');
app.use('/', glOrienPut)

//get layout
let layout = require('../server/routes/layout.js');
app.use('/', layout)

//get colorMode
let colorMod = require('../server/routes/colorMode.js');
app.use('/', colorMod)

//get brightness
let brightnesss = require('../server/routes/brightness.js');
app.use('/', brightnesss)

//get colorTemp
let colorTemp = require('../server/routes/colorTemp.js');
app.use('/', colorTemp)

//get saturation
let saturation = require('../server/routes/saturation.js');
app.use('/', saturation)

//get hue
let hues = require('../server/routes/hue.js');
app.use('/', hues)

// Server port
const HTTP_PORT = 16021;

// Start server
const serv = app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
});

//function

let toke = [];

function setToken() {
    toke.splice(0, toke.length) ;   
    db1.each('SELECT token FROM users',[], function(err,row) {
        tok = Object.values(row);
        toke.push(tok);
    });
    setTimeout(() => {
        sessionStorage.setItem("toke",toke)
    }, 100);
}
setToken();

function validtoken(tovalidate) {
    return toke.join(',').split(',').indexOf(tovalidate) > -1;
}

function setState(bool) {
    db1.run('UPDATE one SET value=?', [bool], function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
}

function setColorMode(string) {
    db1.run('UPDATE colorMode SET colorMode=?', [string], function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    mod = string
}

function clearSelect() {
    db1.run('UPDATE selects SET selects=?', [''], function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
}

//init display from db
createPanel(Data);

function setType(typ) {
    db1.run('UPDATE type SET type=?', [typ], function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    ty = typ
}

function latest() {
    exporter.all(function (err, all) {
        globalOrientation = JSON.parse(Object.values(all.panelLayout)[0].globalOrientation).value; //int
        state = Object.values(all.one)[0].value; //bool
        brightnes = JSON.parse(Object.values(all.state)[0].brightness).value;
        sat = JSON.parse(Object.values(all.sat)[0].sat).value;
        ct = JSON.parse(Object.values(all.ct)[0].ct).value;
        type = Object.values(all.type)[0].type;
        light = (((ct - 1200) / 10.6) /10) + 50; //ct change lightness betwen 50 and 100% so, colorTemp - min / 10.6 (5300 / 50 = 106 so 10.6%) / 10 (to convert in %) + 50%
        //this is stupid because it's supposed to use hsb but i use hsl, but too lazy to change that
        hue = JSON.parse(Object.values(all.hue)[0].hue).value;
        effect = Object.values(all.selects)[0].selects;
        brightness(Data, brightnes, 0);
        onOff(state);
        rotate(globalOrientation);
        if(effect == "") {
            hsl(Data,hue,sat,light);
        }
        setType(type);
    });
}
latest();

function onOff(bool) {
    exporter.all(function (err, all) {
        effect = Object.values(all.selects)[0].selects;
        if(bool == "true") {
            if(effect != "") {
                db1.get('SELECT * FROM effects WHERE effectsList =?', [effect], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    Anim = JSON.parse(row.effectsData);
                    if(Anim.animType == "custom" || Anim.animType == "static") {
                        setType('*Static*');
                        animData(Anim);
                    } else if(effect == "*Solid*") {
                        hsl(Data, hue,sat,light);
                        setType('*Solid*')
                    } else {
                        setType('plugin');
                        setColorMode('effect');
                        show(Anim);
                        custom = false;
                    }
                });
            }
        } else if(bool == "false"){
            off(Data);
        } 
    });
    
    
}

//### SSDP SERVER NOTIFY ###//

//show 3 ssdp device instead of one
let Server = require('node-ssdp').Server, server = new Server({
udn : 'uuid:123456-1234-1234-123456789abc',
location: 'http://localhost:16021',
ttl:60,
adInterval:30000
});

server.addUSN('nanoleaf:nl29');

server.start();

function exit() {
    console.log(db1.close())
    serv.close()
    server.stop()
}

document.getElementById("menu").addEventListener("click", exit);



// Flow 2+ chosen colors gradually mix into each other as if flowing paint is mixing	transTime, delay time, loop, LinDirection
// Wheel Color gradient cycles across panels in a user specified direction	transTime, loop, LinDirection

// Fade	Colors cycle across panels in sync	transTime, delay time, loop
// Explode	Similar to flow, but the colors move out from the centre of the panel system, rather than the edge	transTime, delay time, loop

