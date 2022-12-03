const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./dbconfig');

// on définit root
// app.get('/', (req, res)=> {
//     res.send('Chocolat chaud !');
// });

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});


app.listen(port, () => {  
    console.log(`Serveur à l'écoute sur le port ${port}`)      
});

app.get('/videos', db.getVideos);
