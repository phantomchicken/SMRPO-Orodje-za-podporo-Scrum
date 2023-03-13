var express = require('express');
var router = express.Router();

/* GET home page. */
const ctrlDb = require('../controllers/db');
const { expressjwt: jwt } = require("express-jwt");
const authentication = jwt({
    secret: process.env.JWT_PASSWORD,
    userProperty: 'payload',
    algorithms: ['HS256']
});

router.route('/')
    .get(ctrlDb.getUsers)
    .post(ctrlDb.addUser)

router.route('/user')
    .post(ctrlDb.register)

router.route('/user/login')
    .post(ctrlDb.login)

router.route('/user/:idUser')
    .get(ctrlDb.getUser)
    .put(authentication, ctrlDb.updateUser)
    .delete(authentication, ctrlDb.deleteUser)

router.route('/users')
    .get(ctrlDb.getUsers)

module.exports = router;