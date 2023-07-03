const express = require('express');
const { route } = require('express/lib/application');

const router = express.Router();

const Tmdb = require('../controllers/tmdb.controller');

//router.post('/movies', Tmdb.insertMultipleMovie);

// router.post('/categories', Tmdb.insertAllCategorie);

//router.post('/discover', Tmdb.insertSomeMovie);

//router.post('/serie', Tmdb.insertSomeSerie);

//router.post('/seriecat', Tmdb.insertCategorieSerie);

module.exports = router;
