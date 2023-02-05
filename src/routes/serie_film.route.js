const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const SerieFilm = require('../controllers/serie_film.controller');

router.get('/', SerieFilm.getAllSeriefilm);

module.exports = router;