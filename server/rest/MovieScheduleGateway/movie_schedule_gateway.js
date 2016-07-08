'use strict'

const express = require('express');
const router = express.Router();
const apicache = require('apicache').options({debug: true}).middleware;
const showtimes = require('showtimes');

router.get('/theaters/:name/:zip/:day', apicache('1 day'), function(req, res){
    req.apicacheGroup = req.params.name+req.params.zip+req.params.day;
    let name = req.params.name;
    let zip = req.params.zip;
    let day = req.params.day;

    var api = new showtimes(zip.zip_code, {date: day});

    api.getTheaters((err, theaters) => {
        if(err){
            res.status(400).send('Ooops something went wrong');
            return;
        }

        res.send(theaters);
    });
});

module.exports = router;