'use strict'

const express = require('express');
const router = express.Router();

const moviesGateway = require('./rest/MoviesGateway/movies_gateway');
router.use('/movies', moviesGateway);

module.exports = router;