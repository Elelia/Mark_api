const express = require('express');
const { route } = require('express/lib/application');

const router = express.Router();

const Users = require('../controllers/users.controller');
const session = require('../utils/session');

// route qui retourne tous les comptes de la db
router.get('/', Users.allUsers);

// route qui permet de connecter un utilisateur s'il a rentré son bon mail et mpd
router.post('/auth/login', Users.loginUser);

router.post('/auth/google', Users.loginGoogle);

router.get('/auth/test/:id', Users.allUsers);

router.post('/auth/refresh/');

router.get('/user/', session.authenticateToken, Users.userById);

router.post('/auth/logout', Users.logoutUser);

router.get('/user/mail/:mail', Users.userByMail);

router.post('/create', Users.createOneUser);

router.post('/prefcat', Users.createPreferenceCategorie);

router.put('/updateUser', session.authenticateToken, Users.modifyUser);

router.post('/contact', Users.formContact);

module.exports = router;
