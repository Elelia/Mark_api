//la classe User
const User = require('../models/users.class');
//les fonctions liées à user
const UserFunction = require('../models/users');
const jwt = require('jsonwebtoken');

//fonction qui permet de connecter un utilisateur
async function loginUser(req, res) {
    var mail = req.body.email;
    var mdp = req.body.password;
    const result = await UserFunction.connectUser(mail, mdp);
    if (result.length > 0) {
        // create a new user object
        let user = result.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        //revoir les codes d'erreur
        // Generate JWT
        //const payload = { user: user.id };
        //const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
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

module.exports = {
    loginUser,
    allUsers
};