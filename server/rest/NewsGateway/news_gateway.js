'use strict'

const express = require('express');
const axios = require('axios');
const apicache = require('apicache').options({debug: true}).middleware;;
const router = express.Router();
const newsScrapper = require('./imdb_news_scrapper');

router.get('/latest/:page', apicache('1 day'), (req, res) => {
	req.apicacheGroup = req.params.page;
	let page = req.params.page;

	let promise = new Promise((resolve, reject) => {
		newsScrapper.getLatestNews(page, resolve, reject);
	});

	promise.then((data) => {
		res.status(200).send(data);
	}).catch((err) => {
		console.error(err.message);
		res.status(400).send('Ooops something went wrong');
	});

});

router.get('/content/:title', apicache('1 day'), (req, res) =>{
	req.apicacheGroup = req.params.title;
	let title = req.params.title;

	let promise = new Promise((resolve, reject) => {
		newsScrapper.getContent(title, resolve, reject);
	});

	promise.then((data) => {
		res.status(200).send(data);
	}).catch((err) => {
		console.error(err.message);
		res.status(400).send('Ooops something went wrong');
	});
});

module.exports = router;