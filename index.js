// import essentiels pour la connexion
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
//const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

//app.use(cors({
//  origin: 'https://mark-website-sigma.vercel.app'
//}));

app.use(cors({
  origin: 'http://localhost:3000'
}));

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