var dbConn = require('../../dbconfig');

var User = (user) => {
  this.id = id;
  this.nom = user.nom;
  this.prenom = user.prenom;
  this.mail = user.mail;
  this.admin = user.admin;
  this.mdp = user.mdp;
}

//get user
User.getAllUsers = (response) => {
    dbConn.query('SELECT * FROM compte', (err, res) => {
      if (err) {
        throw err
      }
      console.log('All users is a success !');
      response(null,res.rows);
      //response.status(200).json(res.rows);
    })
}

//connect user
User.connectUser = (mail, mdp, response) => {
  dbConn.query('SELECT * FROM compte WHERE mail=$1 and mdp=$2', [mail, mdp], (err, res) => {
    if (err) {
      throw err
    }
    console.log('Connect one user is a success !');
    response(null,res.rows);
  })
}

module.exports = User;