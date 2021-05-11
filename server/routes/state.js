const db1 = require('../database.js');

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());

    router.put("/api/v1/:auth_token/state", (req, res, next) => {
        res.contentType('application/json');
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json();
        } else {
            let json = req.body;
            // stop current effect if there is one
            exporter.all(function (err, all) {
                let mod = Object.values(all.colorMode)[0].colorMode;
                //on/off
                try {
                    let val = json.on["value"].toString();
                    let bool = Object.values(all.one)[0].value;
                    res.status(204);
                    res.json();
                    if(val != bool) {
                        onOff(val);
                    }
                    setState(val.toString());
                } catch {}
                
                //brightenss
                try {
                    let dur = 0;
                    let inc;
                    let bright = json.brightness["value"];
                    if(Object.keys(json.brightness).length >= 2) {
                        dur = json.brightness["duration"];
                    }
                    if (json.brightness["increment"] != undefined) {
                        let curr = JSON.parse(Object.values(all.state)[0].brightness).value;
                        bright = json.brightness["increment"];
                        inc = json.brightness["increment"];
                        if(bright + curr >100) {
                            bright = 100;
                        } else if(bright + curr < 0) {
                            bright = 0;
                        } else {
                            bright = bright + curr;
                        }
                    }
                    if ((bright >= 0 && bright <= 100) || (inc >= -100 && inc <= 100)) {
                        let dic = {
                            'value' : bright,
                            'max' : 100,
                            'min' : 0
                        }
                        db1.run('UPDATE state SET brightness=?', [JSON.stringify(dic)], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                        });
                        brightness(Data, bright, dur);
                        res.status(204);
                        res.json();
                    } else {
                        res.status(400);
                        res.json();
                    }
                } catch {}
    
                //hue
                //hsl h = hue, s = sat, l = ct
                try {
                    let inc;
                    let hue = json.hue["value"];
                    if (json.hue["increment"] != undefined) {
                        let curr = JSON.parse(Object.values(all.hue)[0].hue).value;
                        hue = json.hue["increment"];
                        inc = json.hue["increment"];
                        if(hue + curr >360) {
                            hue = 360;
                        } else if(hue + curr < 0) {
                            hue = 0;
                        } else {
                            hue = hue + curr;
                        }
                    }
                    if ((hue >= 0 && hue <= 360) || (inc >= -360 && inc <= 360)) {
                        let dic = {
                            'value' : hue,
                            'max' : 360,
                            'min' : 0
                        }
                        if (mod == "effect") {
                            clearTimeout(effectTimeout);
                            clearInterval(effectInterval);
                            removeTrans(Data);
                            clearPanel(Data);
                        }
                        setState("true");
                        clearSelect();
                        setType('*Solid*');
                        setColorMode('hs');
                        db1.run('UPDATE hue SET hue=?', [JSON.stringify(dic)], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                        });
    
                        //get h s l and render
                        exporter.all(function (err, all) {
                            let sat = JSON.parse(Object.values(all.sat)[0].sat).value;
                            let ct = JSON.parse(Object.values(all.ct)[0].ct).value;
                            let light = (((ct - 1200) / 10.6) /10) + 50;
                            setTimeout(() => {
                                hsl(Data, hue,sat,light)
                            }, 50);
                        });
                        res.status(204);
                        res.json();
                    } else {
                        res.status(400);
                        res.json();
                    }
                } catch {}
    
                //Saturation
                try {
                    let inc;
                    let sat = json.sat["value"];
                    if (json.sat["increment"] != undefined) {
                        let curr = JSON.parse(Object.values(all.sat)[0].sat).value
                        sat = json.sat["increment"]
                        inc = json.sat["increment"]
                        if(sat + curr >100) {
                            sat = 100
                        } else if(sat + curr < 0) {
                            sat = 0
                        } else {
                            sat = sat + curr
                        }
                    }
                    if ((sat >= 0 && sat <= 100) || (inc >= -100 && inc <= 100)) {
                        let dic = {
                            'value' : sat,
                            'max' : 100,
                            'min' : 0
                        }
                        if (mod == "effect") {
                            clearTimeout(effectTimeout);
                            clearInterval(effectInterval);
                            removeTrans(Data);
                            clearPanel(Data);
                        }
                        db1.run('UPDATE sat SET sat=?', [JSON.stringify(dic)], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                        });
                        clearSelect();
                        setType('*Solid*');
                        setColorMode('hs');
                        setState("true");
                        //render
                        exporter.all(function (err, all) {
                            let hue = JSON.parse(Object.values(all.hue)[0].hue).value
                            let ct = JSON.parse(Object.values(all.ct)[0].ct).value
                            let light = (((ct - 1200) / 10.6) /10) + 50
                            hsl(Data, hue,sat,light)
                        });
                        res.status(204);
                        res.json()
                    } else {
                        res.status(400);
                        res.json()
                    }
                } catch {}
    
                //ColorTemp 
                try {
                    let inc;
                    let ct = json.ct["value"]
                    if (json.ct["increment"] != undefined) {
                        let curr = JSON.parse(Object.values(all.ct)[0].ct).value
                        ct = json.ct["increment"]
                        inc = json.ct["increment"]
                        if(ct + curr >6500) {
                            ct = 6500
                        } else if(ct + curr < 1200) {
                            ct = 1200
                        } else {
                            ct = ct + curr
                        }
                    }
                    if ((ct >= 1200 && ct <= 6500) || (inc >= -1200 && inc <= 6500)) {
                        let dic = {
                            'value' : ct,
                            'max' : 6500,
                            'min' : 1200
                        }
                        if (mod == "effect") {
                            clearTimeout(effectTimeout);
                            clearInterval(effectInterval);
                            removeTrans(Data);
                            clearPanel(Data);
                        }
                        db1.run('UPDATE ct SET ct=?', [JSON.stringify(dic)], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                        });
                        clearSelect()
                        setState("true");
                        setType('*Solid*');
                        setColorMode('ct');
                        //render
                        let temp = Object.values(colorTemperatureToRGB(ct))
                        let color = rgb2hsl(temp)
                        hsl(Data, color[0], color[1], color[2])
                        res.status(204);
                        res.json()
                    } else {
                        res.status(400);
                        res.json()
                    }
                }catch {}
            });
        }
    });

    return router;
})();
