const db1 = require('../database.js');
const SqliteToJson = require('sqlite-to-json');
const exporter = new SqliteToJson({
    client: db1
});

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    let router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.get("/api/v1/:auth_token/state/colorMode", (req, res, next) => {
        let token = req.params.auth_token;
        if (validtoken(token) != true) {
            res.status(401);
            res.json();
        } else {
            exporter.all(function (err, all) {
                let mode = Object.values(all.colorMode)[0].colorMode;
                res.status(200);
                res.json(mode);
            });
        }
    });
    return router;
})();