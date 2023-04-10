const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const SerieFilm = require('../controllers/serie_film.controller');

router.get('/film', SerieFilm.allFilm);

router.get('/film/categories', SerieFilm.allCategorieFilm);

router.get('/serie', SerieFilm.allSerie);

router.get('/serie/categories', SerieFilm.allCategorieSerie);

router.put('/avis/insert', SerieFilm.addAvis);

router.get('/avis/:serie_film_id', SerieFilm.allAvis);

router.get('/video/url/:id_video', SerieFilm.oneUrlVideo);

module.exports = router;