const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const Tmdb = require('../controllers/tmdb.controller');

router.put('/movies', Tmdb.insertMultipleMovie);

//router.put('/categories', Tmdb.insertAllCategorie);

router.put('/discover', Tmdb.insertSomeMovie);

router.put('/serie', Tmdb.insertSomeSerie);

router.put('/seriecat', Tmdb.insertCategorieSerie);

module.exports = router;