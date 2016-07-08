'use strict'

const express = require('express');
const router = express.Router();

const moviesGateway = require('./rest/MoviesGateway/movies_gateway');
const movieInfoGateway = require('./rest/MovieInfoGateway/movie_info_gateway');
router.use('/movies', moviesGateway);
router.use('/movie', movieInfoGateway);

module.exports = router;