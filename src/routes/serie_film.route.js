const express = require('express');

const router = express.Router();

const SerieFilm = require('../controllers/serie_film.controller');
const session = require('../utils/session');

// start DDB
router.get('/film', SerieFilm.allFilm);

router.get('/film/categories', SerieFilm.allCategorieFilm);

router.get('/serie', SerieFilm.allSerie);

router.get('/serie/categories', SerieFilm.allCategorieSerie);

router.post('/avis/insert', session.authenticateToken, SerieFilm.addAvis);

router.get('/avis/:serie_film_id', SerieFilm.allAvis);

router.get('/video/url/:id_video', SerieFilm.oneUrlVideo);

router.get('/film/id_categorie/:cat_id', SerieFilm.filmByCategorieId);

//route qui permet de retourner des films en fonction des préférences catégories de l'utilisateur
router.get('/film/bypref', session.authenticateToken, SerieFilm.filmByPreference);

// fin start, début des routes pour ajout films/séries
router.get('/film/get_tmdb/:id', SerieFilm.getMoviesCatTMDB);

router.post('/film/insertMovie', SerieFilm.insertMovieSelected);

router.get('/serie/get_tmdb/:id', SerieFilm.getSeriesCatTMDB);

router.post('/serie/insertSerie', SerieFilm.insertSerieSelected);

router.post('/saw', session.authenticateToken, SerieFilm.videoSaw);

router.put('/film/update', SerieFilm.updateMovie);

router.delete('/film/delete', SerieFilm.deleteMovie);

router.get('/film/most_seen', SerieFilm.movieMostSeen);

router.get('/film/last', SerieFilm.movieLast);

router.get('/serie/saison/:id_serie', SerieFilm.saisonByIdSerie);

router.get('/serie/saison/episode/:id_saison', SerieFilm.episodeByIdSaison);

module.exports = router;
