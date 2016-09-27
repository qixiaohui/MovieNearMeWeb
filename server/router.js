'use strict'

const express = require('express');
const router = express.Router();

const moviesGateway = require('./rest/MoviesGateway/movies_gateway');
const movieInfoGateway = require('./rest/MovieInfoGateway/movie_info_gateway');
const movieScheduleGateway = require('./rest/MovieScheduleGateway/movie_schedule_gateway');
const newsGateway = require('./rest/newsGateway/news_gateway');

router.use('/movies', moviesGateway);
router.use('/movie', movieInfoGateway);
router.use('/schedule', movieScheduleGateway);
router.use('/news', newsGateway);

module.exports = router;