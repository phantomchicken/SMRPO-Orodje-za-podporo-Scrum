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
    .post(ctrlDb.addSprint)
router.route('/projects')
    .get(ctrlDb.getSprints)
router.route('/project/:idProject')
    .get(ctrlDb.getSprint)
    .put(authentication, ctrlDb.updateSprint)
    .delete(authentication, ctrlDb.deleteSprint)

router.route('/projects')
    .get(ctrlDb.getProjects)
router.route('/project/:idProject')
    .get(ctrlDb.getProject)
    .put(authentication, ctrlDb.updateProject)
    .delete(authentication, ctrlDb.deleteProject)


router.route('/project')
    .post(ctrlDb.addProject)
router.route('/story')
    .post(ctrlDb.createStory)

module.exports = router;