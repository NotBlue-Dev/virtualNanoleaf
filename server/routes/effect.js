const db1 = require('../database.js');
const SqliteToJson = require('sqlite-to-json');
const exporter = new SqliteToJson({
    client: db1
});

module.exports = (function() {
    'use strict';
    let animName
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    let waitingValue;
    let waitingValuePluginType;
    let waitingValueColorType;
    let cust;
    let toAdd;
    let dur;
    let dat;
    let toDisplay;
    router.put("/api/v1/:auth_token/effects", (req, res, next) => {
        res.contentType('application/json');
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json();
        } else {
            let json = req.body;
            try {   
                let select = json.select;
                if(select != undefined) {
                    db1.get('SELECT * FROM effects WHERE effectsList =?', [select], (err, row) => {
                        if (err || row == undefined || row == null) {
                            res.status(404);
                            res.json();
                        } else {
                            let Anim = JSON.parse(row.effectsData);
                            if (mod == "effect") {
                                clearTimeout(effectTimeout);
                                clearInterval(effectInterval);
                                removeTrans(Data);
                                clearPanel(Data);
                            }
                            if(Anim.animType == "custom" || Anim.animType == "static") {
                                animData(Anim);
                                setType('*Static*');
                            } else {
                                show(Anim);
                            }
                            setColorMode('effect');
                            setType('plugin');
                            db1.run('UPDATE selects SET selects=?', [select], function(err) {
                                if (err) {
                                    return console.error('error');
                                }
                                select = undefined;
                            });
                            res.status(204);
                            res.json();
                        }
                    });
                    //clear var
                }
            } catch {
                console.log('catch2')
            }
            
            // REQUESTS
            try {
                let cmd = json.write.command

                exporter.all(function (err, all) {
                    let mod = Object.values(all.colorMode)[0].colorMode
                    if(cmd != undefined) {
                        switch (cmd) {
                            case "add": 
                                waitingValue = ["random", "flow", "wheel", "fade", "highlight", "custom","dynamic", "static", "plugin","solid"];
                                waitingValuePluginType = ["color", "rythm"];
                                waitingValueColorType = ["HSB", "RGB"];
                                cust = ["static","custom"];
                                toAdd = json.write;
                                delete toAdd['command'];
                                dat = JSON.stringify(json.write);
                                //if colorType/AnimType is defined
                                if(waitingValue.indexOf(toAdd.animType) != -1 && waitingValueColorType.indexOf(toAdd.colorType) != -1) {
                                    if (mod == "effect") {
                                        clearTimeout(effectTimeout);
                                        clearInterval(effectInterval);
                                        removeTrans(Data);
                                    } 
                                    //need to not clear if static
                                    if(ty == 'plugin') {
                                        removeTrans(Data);
                                        clearPanel(Data);
                                    }
                                    //if AnimType = custom/static and no pluginType is defined, and no PluginUUid
                                    if(cust.indexOf(toAdd.animType) !=-1 && waitingValuePluginType.indexOf(toAdd.pluginType) == -1 && pluginLegacy.indexOf(toAdd.pluginUuid) == -1) {
                                        db1.run('INSERT OR REPLACE INTO effects ("effectsList","selects","effectsData") VALUES (?,?,?)', [json.write.animName,'false',dat], function (err, result) {
                                            if (err) {
                                                return console.error(err.message);
                                            }
                                            setType('*Static*');
                                        });
                                        animData(toAdd)
                                        res.status(204);
                                        res.json();
                                    } else if (toAdd.animType == "solid") {
                                        db1.run('INSERT OR REPLACE INTO effects ("effectsList","selects","effectsData") VALUES (?,?,?)', [json.write.animName,'false',dat], function (err, result) {
                                            if (err) {
                                                return console.error(err.message);
                                            }
                                        });
                                        setType('*Solid*');
                                        //when put solid after "romantic" some color glitch
                                        Solid(Data, 0, toAdd.palette)
                                        res.status(204);
                                        res.json();
                                    } else {
                                        if(waitingValuePluginType.indexOf(toAdd.pluginType) != -1 && pluginLegacy.indexOf(toAdd.pluginUuid) != -1 && cust.indexOf(toAdd.animType) ==-1) {
                                            db1.run('INSERT OR REPLACE INTO effects ("effectsList","selects","effectsData") VALUES (?,?,?)', [json.write.animName,'false',dat], function (err, result) {
                                                if (err) {
                                                    return console.error(err.message);
                                                }
                                            });
                                            setType('plugin');
                                            setColorMode('effect');
                                            show(toAdd);
                                            res.status(204);
                                            res.json();
                                        }
                                        else {
                                            res.status(400);
                                            res.json();
                                        }
                                    }
                                }
                                break;
                            case "delete": 
                                animName = json.write.animName;
                                exporter.all(function (err, all) {
                                    let mode = Object.values(all.effects)
                                    let exist = findWithAttr(mode, "effectsList", animName)
                                    if(exist == -1) {
                                        res.status(404);
                                        res.json();
                                    } else {
                                        db1.run('delete FROM effects where effectsList=?', [animName], function(err) {
                                            if (err) {
                                                res.status(400);
                                                res.json();
                                                console.log(err)
                                            } else {
                                                res.status(204);
                                                res.json();
                                            }
        
                                        });
        
                                    }
                                });
                                break;
                            case "request": 
                                animName = json.write.animName
                                db1.get('SELECT * FROM effects WHERE effectsList =?', [animName], (err, row) => {
                                    if (err || row == undefined || row == null) {
                                        res.status(404);
                                        res.json();
                                    } else {
                                        res.status(200);
                                        res.json(JSON.parse(row.effectsData));
                                    }
                                });
                                break;
                            case "requestAll": 
                                exporter.all(function (err, all) {
                                    let mainJson = {
                                        "animations": []
                                    }
                                    let dataEffect = Object.values(all.effects)
                                    dataEffect.forEach(function(item){
                                        mainJson.animations.push(JSON.parse(item.effectsData))
                                    });
                                    res.status(200);
                                    res.json(mainJson);
                                });
        
                                break;
                            case "rename": 
                                animName = json.write.animName;
                                let newName = json.write.newName;
                                exporter.all(function (err, all) {
                                    let mode = Object.values(all.effects)
                                    let exist = findWithAttr(mode, "effectsList", animName)
                                    if(exist == -1) {
                                        res.status(404);
                                        res.json();
                                    } else {
                                        db1.run('UPDATE effects SET effectsList=? WHERE effectsList=?', [newName, animName], function(err) {
                                            if (err) {
                                                res.status(400);
                                                res.json();
                                            } else {
                                                res.status(204);
                                                res.json();
                                            }
                                        });
                                    }
                                });
                                break;
                            case "display": 
                            //dynamic not supported
                                waitingValue = ["random", "flow", "wheel", "fade", "highlight", "custom", "static", "plugin","dynamic","solid"];
                                cust = ["static","custom"];
                                waitingValuePluginType = ["color", "rythm"];
                                waitingValueColorType = ["HSB", "RGB"];
                                toDisplay = json.write;
                                delete toDisplay['command'];
                                dat = JSON.stringify(json.write);
                                //if animtype good, and colorType good
                                if(waitingValue.indexOf(toDisplay.animType) != -1 && waitingValueColorType.indexOf(toDisplay.colorType) != -1) {
                                    if (mod == "effect") {
                                        clearTimeout(effectTimeout);
                                        clearInterval(effectInterval);
                                        removeTrans(Data);
                                    } 
                                    //need to not clear if static
                                    if(ty == 'plugin') {
                                        removeTrans(Data);
                                        clearPanel(Data);
                                    }
                                    //if custom good, and no pluginUuid/type
                                    if(cust.indexOf(toDisplay.animType) !=-1 && waitingValuePluginType.indexOf(toDisplay.pluginType) == -1 && pluginLegacy.indexOf(toDisplay.pluginUuid) == -1) {
                                        setType('*Static*');
                                        animData(toDisplay)
                                        res.status(204);
                                        res.json();
                                    
                                    } else if (toDisplay.animType == "solid") {
                                        setType('*Solid*');
                                        //when put solid after "romantic" some color glitch
                                        Solid(Data, 0, toDisplay.palette)
                                        res.status(204);
                                        res.json();
    
                                    } else {
                                        //si PluginUuid/type and animType != custom
                                        if(waitingValuePluginType.indexOf(toDisplay.pluginType) != -1 && pluginLegacy.indexOf(toDisplay.pluginUuid) != -1 && cust.indexOf(toDisplay.animType) ==-1) {
                                            setType('plugin');
                                            setColorMode('effect');
                                            show(toDisplay);
                                            res.status(204);
                                            res.json();
                                        }
                                        else {
                                            res.status(400);
                                            res.json();
                                        }
                                    }
                                } else {
                                    res.status(400);
                                    res.json();
                                }
                                break;
                            case "displayTemp": 
                                waitingValue = ["random", "flow", "wheel", "fade", "highlight", "custom", "static", "plugin","dynamic","solid"];
                                cust = ["static","custom"];
                                waitingValuePluginType = ["color", "rythm"];
                                waitingValueColorType = ["HSB", "RGB"];
                                toDisplay = json.write;
                                delete toDisplay['command'];
                                dur = toDisplay.duration;
                                dat = JSON.stringify(json.write);
                                if(dur != undefined) {
                                    if (mod == "effect") {
                                        clearTimeout(effectTimeout);
                                        clearInterval(effectInterval);
                                        removeTrans(Data);
                                    } 
                                    //need to not clear if plugin
                                    if(ty == 'plugin') {
                                        removeTrans(Data);
                                        clearPanel(Data);
                                    }
    
                                    if(cust.indexOf(toDisplay.animType) !=-1 && waitingValuePluginType.indexOf(toDisplay.pluginType) == -1 && pluginLegacy.indexOf(toDisplay.pluginUuid) == -1 && toDisplay.animName == undefined) {
                                        animData(toDisplay,dur)
                                        res.status(204);
                                        res.json();
                                    //select anim temp part
                                    } else if(toDisplay.animName != undefined ) {
                                        let selectTemp = toDisplay.animName
                                        db1.get('SELECT * FROM effects WHERE effectsList =?', [selectTemp], (err, row) => {
                                            if (err || row == undefined || row == null) {
                                                res.status(404);
                                                res.json();
                                            } else {
                                                let Anim = JSON.parse(row.effectsData);
                                                if(Anim.animType == "custom" || Anim.animType == "static") {
                                                    animData(Anim,dur);
                                                    res.status(204);
                                                    res.json();
                                                } else if (Anim.animType == "solid") {
                                                    setColorMode('*Solid*')
                                                    //when put solid after "romantic" some color glitch
                                                    Solid(Data, dur, Anim.palette)
                                                    res.status(204);
                                                    res.json();
                                                } else {
                                                    clearPanel(Data);
                                                    show(Anim,dur);
                                                    res.status(204);
                                                    res.json();
                                                }
                                            }
                                        });
                                    }
                                    //end
                                    else if (toDisplay.animType == "solid") {
                                        //when put solid after "romantic" some color glitch
                                        Solid(Data, dur, toDisplay.palette);
                                        res.status(204);
                                        res.json();
    
                                    } else {
                                        if(waitingValuePluginType.indexOf(toDisplay.pluginType) != -1 && pluginLegacy.indexOf(toDisplay.pluginUuid) != -1 && cust.indexOf(toDisplay.animType) ==-1) {
                                            show(toDisplay,dur);
                                            res.status(204);
                                            res.json();
                                        }
                                        else {
                                            res.status(400);
                                            res.json();
                                        }
                                    }
                                } else {
                                    res.status(400);
                                    res.json();
                                }
                                break;
                            case "requestPlugins":
                                console.log('request')
                                let pluginJson = {
                                    "plugins": []
                                } 
                                exporter.all(function (err, all) {
                                    let pluginsList = Object.values(all.plugins)
                                    pluginsList.forEach(function(item){
                                        pluginJson.plugins.push(JSON.parse(item.pluginsData))
                                    });
                                    res.status(200);
                                    res.json(pluginJson);
                                });
                                break;
                            default:
                                res.status(400);
                                res.json();
                                break;
                    }
                    //clear var
                    cmd = undefined
                    }
                });
                
            } catch {   
                console.log('catch')              
            }
        }
    });
    return router;
})();