//la classe User
const User = require('../models/users.class');
//les fonctions liées à user
const UserFunction = require('../models/users');
//const jwt = require('jsonwebtoken');
//const crypto = require('crypto');
const Token = require('../middleware/token');

//fonction qui permet de connecter un utilisateur
async function loginUser(req, res) {
    var mail = req.body.email;
    var mdp = req.body.password;
    const result = await UserFunction.connectUser(mail, mdp);
    if (result.length > 0) {
        // create a new user object
        let user = result.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        const accessToken = Token.generateToken(user);
        //Token.sendCookie(accessToken);
        console.log(accessToken);
        //revoir les codes d'erreur
        //const secret = crypto.randomBytes(64).toString('hex');
        //console.log(secret);
        //process.env.SECRET_KEY = secret;
        //const payload = { id: user.id, isAdmin: user.admin };
        //const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
        //const decodedToken = jwt.decode(token, { complete: true });
        //console.log(decodedToken.header.alg);
        //process.env.SECRET_KEY = token;
        //console.log(process.env.SECRET_KEY);
        //user[0].token = token;
        //const refreshToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
            accessToken
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

let refreshTokens = [];

const refresh = (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) {
        return res.status(401).json("Nononon");
    }
}

module.exports = {
    loginUser,
    allUsers
};