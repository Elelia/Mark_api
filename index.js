// import essentiels pour la connexion
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');

app.use(cors({
  origin: 'https://mark-website-sigma.vercel.app'
}));

//parse request data content type application/x-www
app.use(bodyParser.urlencoded({extended: false}));

//parse request data type application/json
app.use(bodyParser.json());

//middleware
app.use(express.json());

//test de connexion sur le localhost
app.listen(port, () => {  
    console.log(`Serveur à l'écoute sur le port ${port}`)      
});

app.get("/", (req, res) => {
    res.send("Homepage here.");
});

//import des routes
const usersRoute = require('./src/routes/users.route');

//utilisation des routes
app.use('/users', usersRoute);

//export the Express API
module.exports = app;