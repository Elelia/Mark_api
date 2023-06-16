//import des routes
const usersRoute = require('./src/routes/users.route');
const serfilmRoute = require('./src/routes/serie_film.route');
const tmdbRoute = require('./src/routes/tmdb.route');

const express = require('express');
const app = express();
var cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

//app.use(cors());
app.use(cors({ origin: 'https://mark-website-sigma.vercel.app', credentials: true }));

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

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header("Access-Control-Allow-Origin", "https://mark-website-sigma.vercel.app");
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