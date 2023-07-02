//import des routes
const usersRoute = require('./src/routes/users.route');
const serfilmRoute = require('./src/routes/serie_film.route');
const tmdbRoute = require('./src/routes/tmdb.route');

//initilisation des dépendances nécessaires au fonctionnement de l'API
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

//pour utiliser le format json et les cookies
app.use(express.json());
app.use(cookieParser());

//app.use(cors());
//permet d'autoriser le cross plateforme
//ce qui permet à l'API de communiquer avec le site internet qui n'a pas la même racine
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://mark-website-sigma.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  next();
});*/

/*app.use(cors({
  origin: 'http://localhost:3000'
}));*/

//permet de définir les propriétés dans le header
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

//utilisation des routes
app.use('/users', usersRoute);
app.use('/seriefilm', serfilmRoute);
app.use('/tmdb', tmdbRoute);

/*app.listen(port, () => {  
  console.log(`Serveur à l'écoute sur le port ${port}`)      
});*/

module.exports = app;