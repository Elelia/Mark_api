var dbConn = require('../../dbconfig');

//constructeur de l'objet User
function User(id, nom, prenom, mail, admin, mdp) {
  this.id = id;
  this.nom = nom;
  this.prenom = prenom;
  this.mail = mail;
  this.admin = admin;
  this.mdp = mdp;
}

//get user
exports.getAllUsers = (response) => {
    dbConn.query('SELECT * FROM compte', (err, res) => {
      if (err) {
        throw err
      } if(Array.isArray(res.rows) && res.rows.length === 0) {
        dbConn.end(function() {
          throw new Error('No results found');
        })
      }
      else {
        console.log('Get all users is a success !');
        response(res.rows);
      }
    })
}

//create and connect user
exports.connectUser = (mail, mdp, response) => {
  dbConn.query('SELECT * FROM compte WHERE mail=$1 and mdp=$2', [mail, mdp], (err, res) => {
    if (err) {
      throw err
    } if(Array.isArray(res.rows) && res.rows.length === 0) {
      dbConn.end(function() {
        throw new Error('No results found');
      })
    }
    else {
      var user = new User(res.rows[0].id, res.rows[0].nom, res.rows[0].prenom, res.rows[0].mail, res.rows[0].admin, res.rows[0].mdp);
      console.log('Connect one user is a success !');
      response(user);
    }
  })
}