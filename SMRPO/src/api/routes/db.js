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
    .delete(ctrlDb.deleteAllData)

router.route('/sample')
    .post(ctrlDb.addSampleData)

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

router.route('/sprint')
    .post(ctrlDb.createSprint)

router.route('/project')
    .post(ctrlDb.createProject)
router.route('/story')
    .post(ctrlDb.createStory)

module.exports = router;