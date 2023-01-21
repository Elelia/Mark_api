const UsersModel = require('../models/users');

//constructeur de l'objet User
function User(id, nom, prenom, mail, admin, mdp) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.mail = mail;
    this.admin = admin;
    this.mdp = mdp;
}

//get all user
exports.getAllUsers = (req, res) => {
    //console.log("all users");
    //console.log(res);
    UsersModel.getAllUsers((users) => {
        let allUsers = users.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        let results = JSON.stringify(allUsers);
        console.log("easy les utilisateurs");
        res.send(results);
    })
}

//connect user
exports.connectUser = (req,res) => {
    console.log("try connecting user");
    UsersModel.connectUser(req.params.mail, req.params.mdp, (user) => {
        let userLogin = user.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        let results = JSON.stringify(userLogin);
        console.log("connect one user is a success");
        res.send(results);
    })
}