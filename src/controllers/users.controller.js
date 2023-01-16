const UsersModel = require('../models/users');

//get all user
exports.getAllUsers = (req, res) => {
    console.log("all users");
    //console.log(res);
    UsersModel.getAllUsers((users) => {
        console.log("easy les utilisateurs");
        res.send(users);
    })
}

//connect user
exports.connectUser = (req,res) => {
    console.log("try connecting user");
    UsersModel.connectUser(req.params.mail, req.params.mdp, (user) => {
        console.log("connect one user is a success");
        res.send(user);
    })
}