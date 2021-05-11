const db1 = require('../database.js');

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    //delete authtoken
    router.delete("/api/v1/:auth_token", (req,res,next) => {
        let token = ""
        token = req.params.auth_token;
        db1.run(`DELETE FROM users WHERE token=?`, token, function(err) {
            if (err) {
            return console.error(err.message);
            }
            res.status(204);
            res.json();
        });
    });

    return router;
})();