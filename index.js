// import essentiels pour la connexion
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
//const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://mark-website-sigma.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  next();
});

//app.use(cors({
//  origin: 'http://localhost:3000'
//}));

//parse request data content type application/x-www
app.use(bodyParser.urlencoded({extended: false}));

//parse request data type application/json
app.use(bodyParser.json());

//middleware
app.use(express.json());
app.use(cookieParser());

//test de connexion sur le localhost
app.listen(port, () => {  
    console.log(`Serveur à l'écoute sur le port ${port}`)      
});

app.get("/", (req, res) => {
    res.send("Homepage here.");
});

//import des routes
const usersRoute = require('./src/routes/users.route');
const serfilmRoute = require('./src/routes/serie_film.route');
const tmdbRoute = require('./src/routes/tmdb.route');

//utilisation des routes
app.use('/users', usersRoute);
app.use('/seriefilm', serfilmRoute);
app.use('/tmdb', tmdbRoute);

//export the Express API
module.exports = app;