const Seriefilm = require('../models/class/serie_film.class');
const Film = require('../models/class/film.class');
const SeriefilmFunction = require('../models/serie_film.model');
const FilmFunction = require('../models/film.model');
const SerieFunction = require('../models/serie.model');
const Session = require('../utils/session');
const fs = require('fs');
const TMDBFunction = require('../models/tmdb');

// variables globales pour avoir mes tableaux d'objet ?

// fonction qui retourne tous les films
async function allFilm(req, res) {
  const results = await FilmFunction.getAllFilm();
  if (results) {
    // create a new film object
    const allSeriefilm = results.map((oneSF) => new Film(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, 
      oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, 
      oneSF.cat_nom, oneSF.id_film, oneSF.trailer));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne les catégories des films
async function allCategorieFilm(req, res) {
  const results = await FilmFunction.getAllCategorieFilm();
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne toutes les séries
async function allSerie(req, res) {
  const results = await SerieFunction.getAllSerie();
  if (results) {
    // create a new user object
    const allSeriefilm = results.map((oneSF) => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne les catégories des séries
async function allCategorieSerie(req, res) {
  const results = await SerieFunction.getAllCategorieSerie();
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui permet d'enregistrer un nouvel avis en base
async function addAvis(req, res) {
  const id_compte = req.user.id;
  const id_serie_film = req.body.seriefilmId;
  const comment = req.body.comment;
  const note = req.body.note;
  const date = req.body.date;

  const result = await SeriefilmFunction.insertAvis(id_compte, id_serie_film, comment, note, date);
  if (!result) {
    res.status(400).send('Error while insert avis'); 
  }
  res.status(201).json(result);
}

// fonction qui retourne tous les avis
async function allAvis(req, res) {
  const results = await SeriefilmFunction.getAllAvis(req.params.serie_film_id);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(500).send('No values');
  }
}

//
async function oneUrlVideo(req, res) {
  const results = await SeriefilmFunction.getUrlVideo(req.params.id_video);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(500).send('No values');
  }
}

// fonction qui retourne les informations de films de l'id de la catégorie reçu
async function filmByCategorieId(req, res) {
  const results = await FilmFunction.getFilmByCategorieId(req.params.cat_id);
  if (results) {
    const allSeriefilm = results.map((oneSF) => new Film(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom, oneSF.id_film, oneSF.trailer));
    console.log(allSeriefilm);
    res.status(200).json(allSeriefilm);
  } else {
    res.status(500).send('No values');
  }
}

//fonction qui retourne les films du fichier json mais en fait c'est compliqué
async function getMoviesTMDB(req, res) {
  const results = [];
  fs.readFile('movie_ids_04_01_2023.json', async (error, data) => {
    if (error) {
      console.error(`Error reading file: ${error}`);
      return;
    }
    const movies = JSON.parse(data);
    const movieIds = movies.map((movie) => movie.id);

    for (const movieId of movieIds) {
      const res = await FilmFunction.getMovieTMDB(movieId, req.body.id);
      console.log(res);
      results.push(res);
    }
  });
  res.status(200).json(results);
}

//retrouve 20 films de TMDB en fonction de l'id catégorie envoyé
async function getMoviesCatTMDB(req, res) {
  const results = await FilmFunction.getMovieCatTMDB(req.params.id);
  if(!results) {
    res.status(500).send('No values');
  }
  res.status(200).json(results);
}

//ajoute en base les films sélectionnés via l'admin
async function insertMovieSelected(req, res) {
  await TMDBFunction.insertMovie(req.body.id_movie);
  res.status(200).json({
    success: true,
    message: 'Insert movie selected successful',
  });
}

//retrouve 20 séries de TMDB en fonction de l'id catégorie envoyé
async function getSeriesCatTMDB(req, res) {
  const results = await SerieFunction.getSerieCatTMDB(req.params.id);
  if(!results) {
    res.status(500).send('No values');
  }
  res.status(200).json(results);
}

//ajoute en base les séries sélectionné via l'admin
async function insertSerieSelected(req, res) {
  await SerieFunction.insertSerie(req.body.id_serie);
  res.status(200).json({
    success: true,
    message: 'Insert serie selected successful',
  });
}

async function filmByPreference(req, res) {
  const results = await FilmFunction.getMovieByPref(req.user.id);
  if (results) {
    const allSeriefilm = results.map((oneSF) => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(500).send('No values');
  }
}

//permet de savoir si un utilisateur a vu une vidéo
async function videoSaw(req, res) {
  const results = await SeriefilmFunction.insertVisionnage(req.user.id, req.body.id_film, req.body.id_episode);
  if (!results) {
    res.status(500).send('No values');
  }
  res.status(200).json('Success');
}

//modifie un film
async function updateMovie(req, res) {
  const result = await FilmFunction.updateMovie(req.body.id_movie, req.body.nom, req.body.age_min, req.body.date, req.body.vignette, req.body.affiche, req.body.trailer);
  if(!result) {
    res.status(400).json({
      success: false,
      message: 'Error while updating movie',
    });
  }
  res.status(200).json({
    success: true,
    message: 'Update movie successful',
  });
}

//supprime un film
async function deleteMovie(req, res) {
  const result = await FilmFunction.deleteMovie(req.body.id, req.body.id_film);
  if(!result) {
    res.status(400).json({
      success: false,
      message: 'Error while deleteing movie',
    });
  }
  res.status(200).json({
    success: true,
    message: 'Delete movie selected successful',
  });
}

async function movieMostSeen(req, res) {
  const results = await FilmFunction.getMovieMostSeen();
  if (results) {
    // create a new user object
    const allSeriefilm = results.map((oneSF) => new Film(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom, oneSF.id_film, oneSF.trailer));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

async function movieLast(req, res) {
  const results = await FilmFunction.getLastMovie();
  if (results) {
    // create a new user object
    const allSeriefilm = results.map((oneSF) => new Film(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom, oneSF.id_film, oneSF.trailer));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

//fonction qui récupère les informations des saisons d'une série
async function saisonByIdSerie(req, res) {
  const results = await SerieFunction.getSaisonByIdSerie(req.params.id_serie);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

//fonction qui récupère les informations des saisons d'une série
async function episodeByIdSaison(req, res) {
  const results = await SerieFunction.getEpisodeBySaison(req.params.id_saison);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

module.exports = {
  allFilm,
  allCategorieFilm,
  allSerie,
  allCategorieSerie,
  addAvis,
  allAvis,
  oneUrlVideo,
  filmByCategorieId,
  getMoviesCatTMDB,
  insertMovieSelected,
  getSeriesCatTMDB,
  insertSerieSelected,
  filmByPreference,
  videoSaw,
  updateMovie,
  deleteMovie,
  movieMostSeen,
  movieLast,
  saisonByIdSerie,
  episodeByIdSaison
};
