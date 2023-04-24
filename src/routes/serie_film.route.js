const express = require('express');
const router = express.Router();

const SerieFilm = require('../controllers/serie_film.controller');

//start DDB
router.get('/film', SerieFilm.allFilm);

router.get('/film/categories', SerieFilm.allCategorieFilm);

router.get('/serie', SerieFilm.allSerie);

router.get('/serie/categories', SerieFilm.allCategorieSerie);

router.post('/avis/insert', SerieFilm.addAvis);

router.get('/avis/:serie_film_id', SerieFilm.allAvis);

router.get('/video/url/:id_video', SerieFilm.oneUrlVideo);

router.get('/film/id_categorie/:cat_id', SerieFilm.filmByCategorieId);

//fin start, début des routes pour ajout films/séries

module.exports = router;