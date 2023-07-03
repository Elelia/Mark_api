//fichier qui permet d'indiquer le port sur lequel l'API tourne
//à la base cela se trouvait dans le fichier index mais cette configuration entrait en conflit
//avec l'utilisation d'une dépendance
const app = require("./index");

const port = process.env.PORT || 5000;

app.listen(port, () => {  
    console.log(`Serveur à l'écoute sur le port ${port}`)      
});