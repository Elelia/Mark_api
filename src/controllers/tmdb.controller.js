const fs = require('fs');
const TMDBFuction = require('../models/tmdb');

// start DDB
// fonction qui retourne les catégories
async function insertMultipleMovie(req, res) {
  fs.readFile('movie_ids.json', async (error, data) => {
    if (error) {
      console.error(`Error reading file: ${error}`);
      return;
    }
    const movies = JSON.parse(data);
    const movieIds = movies.map((movie) => movie.id);

    // Loop through movie IDs and retrieve data for each movie
    for (const movieId of movieIds) {
      await TMDBFuction.insertMovie(movieId);
    }
  });
  res.status(200).json({
    success: true,
    message: 'Insert movies successful',
  });
}

async function insertAllCategorie(req, res) {
  const result = await TMDBFuction.insertCategorie();
  if (result) {
    res.status(200).json({
      success: true,
      message: 'Insert categorie successful',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Error while insert categorie',
    });
  }
}

async function insertSomeMovie(req, res) {
  await TMDBFuction.insertLimitMovie();
  res.status(200).json({
    success: true,
    message: 'Insert categorie successful',
  });
}

async function insertSomeSerie(req, res) {
  await TMDBFuction.insertSerie();
  res.status(200).json({
    success: true,
    message: 'Insert categorie successful',
  });
}

async function insertCategorieSerie(req, res) {
  const result = await TMDBFuction.insertCategorieSerie();
  if (result) {
    res.status(200).json({
      success: true,
      message: 'Insert categorie successful',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Error while insert categorie',
    });
  }
}

// fin start, début des controllers pour ajout films/séries via admin

module.exports = {
  insertMultipleMovie,
  insertAllCategorie,
  insertSomeMovie,
  insertSomeSerie,
  insertCategorieSerie,
};
