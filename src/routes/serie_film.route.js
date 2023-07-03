const express = require('express');
const router = express.Router();
const SerieFilm = require('../controllers/serie_film.controller');
const session = require('../utils/session');

router.get('/film', SerieFilm.allFilm);

router.get('/film/categories', SerieFilm.allCategorieFilm);

router.get('/serie', SerieFilm.allSerie);

router.get('/serie/categories', SerieFilm.allCategorieSerie);

router.post('/avis/insert', session.authenticateToken, SerieFilm.addAvis);

router.get('/avis/:serie_film_id', SerieFilm.allAvis);

router.get('/video/url/:id_video', SerieFilm.oneUrlVideo);

router.get('/film/id_categorie/:cat_id', SerieFilm.filmByCategorieId);

router.get('/film/bypref', session.authenticateToken, SerieFilm.filmByPreference);

router.put('/film/update', session.authenticateToken, SerieFilm.updateMovie);

router.delete('/film/delete', session.authenticateToken, SerieFilm.deleteMovie);

// fin start, début des routes pour ajout films/séries
router.get('/film/get_tmdb/:id', SerieFilm.getMoviesCatTMDB);

router.post('/film/insertMovie', session.authenticateToken, SerieFilm.insertMovieSelected);

router.get('/serie/get_tmdb/:id', SerieFilm.getSeriesCatTMDB);

router.post('/serie/insertSerie', session.authenticateToken, SerieFilm.insertSerieSelected);

router.post('/saw', session.authenticateToken, SerieFilm.videoSaw);

router.get('/film/most_seen', SerieFilm.movieMostSeen);

router.get('/film/last', SerieFilm.movieLast);

router.get('/serie/saison/:id_serie', SerieFilm.saisonByIdSerie);

router.get('/serie/saison/episode/:id_saison', SerieFilm.episodeByIdSaison);

router.get('/film/mostSeenCat', SerieFilm.movieCountByCategorie);

router.get('/serie/most_seen', SerieFilm.serieMostSeen);

router.get('/serie/bypref', session.authenticateToken, SerieFilm.serieByPreference);

router.get('/serie/mostSeenCat', SerieFilm.serieCountByCategorie);

router.get('/countbymonth', SerieFilm.seriefilmCountByMonth);

router.get('/film/countbymonth', SerieFilm.filmCountByMonth);

router.get('/serie/countbymonth', SerieFilm.serieCountByMonth);

module.exports = router;
