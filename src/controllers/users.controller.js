const UsersModel = require('../models/users');

//get all user
exports.getAllUsers = (res) => {
    console.log("all users");
    UsersModel.getAllUsers((err, users) => {
        if(err) {
            res.send(err);
        }
        console.log("easy les utilisateurs");
        res.send(users);
    })
}

//connect user
exports.connectUser = (req,res) => {
    console.log("connect user");
    UsersModel.connectUser(req.params.mail, req.params.mdp, (err, users) => {
        if(err) {
            res.send(err);
        }
        console.log("easy la connexion");
        res.send(users);
    })
}