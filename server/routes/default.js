const db1 = require('../database.js');

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.get("/", (req, res, next) => {
        res.status(200);
        res.json({"message":"Ok"});
    });
    return router;
})();