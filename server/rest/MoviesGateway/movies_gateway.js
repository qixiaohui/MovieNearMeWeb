'use strict'

const express = require('express');
const axios = require('axios');
const apicache = require('apicache').options({debug: true}).middleware;;
const router = express.Router();
const theMovieBaseUrl = require('../properties').theMovieBaseUrl;
const theMovieToken = require('../properties').theMovieToken;
const theMovieSearchUrl = require('../properties').theMovieSearchurl;

router.get('/category/:category/:page', apicache('1 day'), function(req, res){
	req.apicacheGroup = req.params.category+req.params.page;
	let category = req.params.category;
	let page = req.params.page;

	axios({method: 'GET',url: `${theMovieBaseUrl}${category}?api_key=${theMovieToken}&language=en&page=${page}`}).then((result) => {
		res.send(result.data);
	}).catch((result) => {
		console.error(result.data.status_message);
		res.status(400).send('Ooops something went wrong');
	});
});

router.get('/search/:name/:page', apicache('1 day'), function (req, res) {
	let keyword = req.params.name;
	let page = req.params.page;

	axios({method: 'GET', url: `${theMovieSearchUrl}${theMovieToken}&query=${keyword}&page=${page}`}).then((result) => {
		res.send(result.data);
	}).catch((result) => {
		console.error(result.data.status_message);
		res.send(400).send('Ooops something went wrong12');
	});
});

module.exports = router;
