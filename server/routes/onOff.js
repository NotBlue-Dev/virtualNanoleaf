
const db1 = require('../database.js');

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.get("/api/v1/:auth_token/state/on", (req, res, next) => {
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json();
        } else {
            exporter.all(function (err, all) {
                let json = {
                    "value":Object.values(all.one)[0].value
                }
                res.status(200);
                res.json(json);
            });
        }
    });

    return router;
})();