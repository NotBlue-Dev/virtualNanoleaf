const db1 = require('../database.js');
const SqliteToJson = require('sqlite-to-json');
const exporter = new SqliteToJson({
    client: db1
});

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.get("/api/v1/:auth_token", (req,res,next) => {
        let token = "";
        token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json();
        } else {
            exporter.all(function (err, all) {
                let alls = all;
                let Hash = Object.values(alls.cloudHash)[0].cloudHash;
                if(Hash == '{}') {
                    Hash = {}
                }
                let discovery = Object.values(alls.discovery)[0].discovery;
                if(discovery == '{}') {
                    discovery = {}
                }
                let firmwareUpgrade = Object.values(alls.firmwareUpgrade)[0].firmwareUpgrade;
                if(firmwareUpgrade == '{}') {
                    firmwareUpgrade = {}
                }
                let schedules = Object.values(alls.schedules)[0].schedules;
                if(schedules == '{}') {
                    schedules = {}
                }
                let eff = Object.values(alls.effects);
                let effs = [];
                eff.forEach(item => {
                    effs.push(item.effectsList);
                }); 
                let info = {
                    "name":Object.values(alls.name)[0].name,
                    "serialNo":Object.values(alls.serialNo)[0].serialNo,
                    "manufacturer":Object.values(alls.manufacturer)[0].manufacturer,
                    "firmwareVersion":Object.values(alls.firmwareVersion)[0].firmwareVersion,
                    "hardwareVersion":Object.values(alls.hardwareVersion)[0].hardwareVersion,
                    "model":Object.values(alls.model)[0].model,
                    "cloudHash":Hash,
                    "discovery":discovery,
                    "effects": {
                        "effectsList":effs,
                        "select":Object.values(alls.selects)[0].selects
                    },
                    "firmwareUpgrade":firmwareUpgrade,
                    "panelLayout": {
                        "globalOrientation":JSON.parse(Object.values(alls.panelLayout)[0].globalOrientation),
                        "layout": {
                            "numPanels":Object.values(alls.layout)[0].numPanels,
                            "sideLength":Object.values(alls.layout)[0].sideLength,
                            "positionData": JSON.parse(Object.values(alls.layout)[0].positionData)
                        }
                    },
                    "schedules":schedules,
                    "state":{
                        "brightness":JSON.parse(Object.values(alls.state)[0].brightness),
                        "colorMode":Object.values(alls.colorMode)[0].colorMode,
                        "ct":JSON.parse(Object.values(alls.ct)[0].ct),
                        "hue":JSON.parse(Object.values(alls.hue)[0].hue),
                        "on":{
                            "value":Object.values(alls.one)[0].value,
                        },
                        "sat":JSON.parse(Object.values(alls.sat)[0].sat),
                    }
                }
                res.contentType('application/json');
                res.status(200);
                res.json(info);
            });
        }
    });

    return router;
})();

