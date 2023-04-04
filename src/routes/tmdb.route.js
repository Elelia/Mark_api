const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const Tmdb = require('../controllers/tmdb.controller');

router.put('/movies', Tmdb.insertMultipleMovie);

//router.put('/categories', Tmdb.insertAllCategorie);

router.put('/discover', Tmdb.insertSomeMovie);

module.exports = router;