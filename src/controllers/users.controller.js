//la classe User
const User = require('../models/class/users.class');
//les fonctions liées à user
const UserFunction = require('../models/users.model');
//pour gérer les tokens
const Token = require('../../session');
//envoie du mail de confirmation
const nodemailer = require("nodemailer");

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
    const result = await UserFunction.getUserById(req.params.id);
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

//retrouver un utilisateur via un mail
async function userByMail(req, res) {
    const result = await UserFunction.getUserByMail(req.params.mail);
    if (result.length > 0) {
        // create a new user object
        let user = result.map(oneUser => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
        console.log(user);
        //revoir les codes d'erreur
        res.status(200).json({
            user,
            message: 'Success'
        });
    } else {
        res.status(200).json({
            message: 'no user with this mail'
        });
    }
}

//fonction qui sert à l'inscription d'un utilisateur, que ce soit via google ou via le formulaire
//envoie également un mail pour signaler que l'inscription a réussit
async function createOneUser(req, res) {
    const result = await UserFunction.insertUser(req.body.nom, req.body.prenom, req.body.mail, req.body.admin, req.body.mdp);
    if(result) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.ADDRESS_MAIL,
              pass: process.env.PASSWORD_MAIL,
            },
        });
        /*transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
        });*/
        let message = {
            from: process.env.ADDRESS_MAIL,
            to: req.body.mail,
            subject: 'Inscription réussie à Mark',
            text: "Bonjour ! Votre inscription à notre site web Mark s'est bien déroulée. Vous pouvez dès à présent vous connecter avec vos identifiants afin de regarder vos films et séries préférés !",
            html: '<p>Contenu du message en format HTML</p>'
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('E-mail envoyé: ' + info.response);
            }
        });
        res.status(200).json({
            success: true,
            message: 'insert new user into compte'
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'insert new user failed'
        });
    }
}

module.exports = {
    loginUser,
    allUsers,
    userById,
    logoutUser,
    userByMail,
    createOneUser
};