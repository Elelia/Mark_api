const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const SerieFilm = require('../controllers/serie_film.controller');

router.get('/', SerieFilm.allSeriefilm);

router.get('/categories', SerieFilm.allCategorie);

router.put('/avis/insert', SerieFilm.addAvis);

router.get('/avis/:serie_film_id', SerieFilm.allAvis);

module.exports = router;