'use strict'

const express = require('express');
const router = express.Router();
const apicache = require('apicache').options({debug: true}).middleware;
const herokuRedirect = require('../properties').herokuRedirect;
const guideboxApi = require('../properties').guideboxApi;
const guideboxKey = require('../properties').guideboxKey;
const axios = require('axios');

router.get('/theaters/:name/:zip/:day', apicache('1 day'), function(req, res){
    req.apicacheGroup = req.params.name+req.params.zip+req.params.day;
    let name = req.params.name;
    let zip = req.params.zip;
    let day = req.params.day;

    axios({method: 'GET', url: `${herokuRedirect}schedule/theaters/${name}/${zip}/${day}`}).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        res.status(400).send('Ooops something went wrong');
    });
});

router.get('/avilableon/webpurchase/:id', apicache('1 day'), function(req, res) {
    req.apicacheGroup = req.params.id;

    let id = req.params.id;
    
    axios({method: 'GET', url: `${guideboxApi}${guideboxKey}/search/movie/id/themoviedb/${id}`}).then((response) => {
        axios({method: 'GET', url: `${guideboxApi}${guideboxKey}/movie/${response.data.id}`}).then((response) => {
            res.send(response.data.purchase_web_sources);
        }).catch((err) => {
            res.status(400).send('Ooops something went wrong');
        });
    }).catch((err) => {
        res.status(400).send('Ooops something went wrong');
    });
});

module.exports = router;