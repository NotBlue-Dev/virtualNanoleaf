const db1 = require('../database.js');



//create token (32char)
function maketoken(length) {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
    charactersLength)));
   }
   return result.join('');
}

module.exports = (function() {
    'use strict';
    let bodyParser = require('body-parser');
    var router = require('express').Router();
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.post("/api/v1/new", (req, res, next) => {
        res.contentType('application/json');
        let token = ""
        token = maketoken(32);
        stmt = 'INSERT INTO users VALUES (?)';
        db1.run(stmt, token, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "auth_token": token
            })
        });
        setTimeout(() => {
            setToken();
        }, 100);
    });

    return router;
})();