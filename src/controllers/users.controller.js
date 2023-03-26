//la classe User
const User = require('../models/class/users.class');
//les fonctions liées à user
const UserFunction = require('../models/users.model');
//pour gérer les tokens
const Token = require('../../session');

//fonction qui permet de connecter un utilisateur
async function loginUser(req, res) {
    var mail = req.body.email;
    var mdp = req.body.password;
    const result = await UserFunction.connectUser(mail, mdp);
    if (result.length > 0) {
        // create a new user object
        let user = result.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        const accessToken = Token.generateToken(user);
        Token.setTokenCookie(res, accessToken);
        //revoir les codes d'erreur
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
            token: accessToken
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Login failed'
        });
    }
}

//fonction qui permet de créer tous les utilisateurs et de les retourner
async function allUsers(req, res) {
    const results = await UserFunction.getAllUsers();
    if (results.length > 0) {
        // create a new user object
        let allUsers = results.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        res.status(200).json(allUsers);
    } else {
        res.status(500).send('No values');
    }
}

async function modifyUser(req, res) {
    var id = req.body.userId;
    var mdp = req.body.verifpassword;
    var oldmdp = req.body.oldpassword;
    var newmdp = req.body.newpassword;
    var mail = req.body.mail;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    const result = await UserFunction.checkPassword(id, mdp);
    if (result) {
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
            token: accessToken
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Login failed'
        });
    }
}

async function userById(req, res) {
    console.log(req.params.id);
    const result = await UserFunction.getUserById(req.params.id);
    console.log(result);
    if (result.length > 0) {
        // create a new user object
        let user = result.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        //revoir les codes d'erreur
        res.status(200).json(user);
    } else {
        res.status(400).json({
            success: false,
            message: 'get user by id failed'
        });
    }
}

//fonction qui permet de connecter un utilisateur
async function logoutUser(req, res) {
    Token.clearTokenCookie(req, res);
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
}

module.exports = {
    loginUser,
    allUsers,
    userById,
    logoutUser
};