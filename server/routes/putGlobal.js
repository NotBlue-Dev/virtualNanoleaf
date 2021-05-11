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

    router.put("/api/v1/:auth_token/panelLayout/globalOrientation", (req, res, next) => {
        res.contentType('application/json');
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json()
        } else {
            try {
                let json = req.body;
                let selec = json.globalOrientation["value"]
                if (selec >= 0 && selec <= 360) {
                    let val = {
                        "value": json.globalOrientation["value"],
                        "max": 360,
                        "min": 0
                    } 
                    db1.run('UPDATE panelLayout SET globalOrientation=?', [JSON.stringify(val)], function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        rotate(json.globalOrientation["value"])
                    });
                    res.status(204);
                    res.json()
                } else {
                    res.status(400);
                    res.json()
                }
            } catch {
                res.status(422)
                res.json()
            }
        }
    });
    return router;
})();
