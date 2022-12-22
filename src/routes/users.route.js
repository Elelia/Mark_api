const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const users = require('../controllers/users.controller');

router.get('/', users.getAllUsers);

router.get('/:mail/:mdp', users.connectUser);

module.exports = router;