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
    router.get("/api/v1/:auth_token/panelLayout/layout", (req, res, next) => {
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json()
        } else {
            exporter.all(function (err, all) {
                let json = {
                        "numPanels":Object.values(all.layout)[0].numPanels,
                        "sideLength":Object.values(all.layout)[0].sideLength,
                        "positionData": JSON.parse(Object.values(all.layout)[0].positionData)
                }
                res.json(json)
            });
        }
    });
    return router;
})();