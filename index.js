// import essentiels pour la connexion
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//test de connexion sur le localhost
app.listen(port, () => {  
    console.log(`Serveur à l'écoute sur le port ${port}`)      
});

app.get("/", (res) => {
    res.send("Homepage here.");
});

//import des routes
const usersRoute = require('./src/routes/users.route');

//utilisation des routes
app.use('/users', usersRoute);
