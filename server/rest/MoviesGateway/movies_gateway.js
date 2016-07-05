'use strict'

const express = require('express');
const axios = require('axios');
const apicache = require('apicache').options({debug: true}).middleware;;
const router = express.Router();
const theMovieBaseUrl = require('../properties').theMovieBaseUrl;
const theMovieToken = require('../properties').theMovieToken;

router.get('/:category', apicache('1 day'), function(req, res){
	req.apicacheGroup = req.params.category;
	let category = req.params.category;

	axios({method: 'GET',url: `${theMovieBaseUrl}${category}?api_key=${theMovieToken}`}).then((result) => {
		res.send(result.data);
	}).catch((result) => {
		console.error(result);
		res.status(400).send('Ooops something went wrong');
	});
});

module.exports = router;