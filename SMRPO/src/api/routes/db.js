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
router.route('/sprints')
    .get(ctrlDb.getSprints)
router.route('/sprint/:idSprint')
    .get(ctrlDb.getSprint)
    .put(authentication, ctrlDb.updateSprint)
    .delete(authentication, ctrlDb.deleteSprint)

router.route('/project')
    .post(ctrlDb.addProject)
router.route('/projects')
    .get(ctrlDb.getProjects)
router.route('/project/:idProject')
    .get(ctrlDb.getProject)
    .put(authentication, ctrlDb.updateProject)
    .delete(authentication, ctrlDb.deleteProject)


router.route('/story')
    .post(ctrlDb.createStory)
router.route('/stories')
    .get(ctrlDb.getStories)
router.route('/story/:idStory')
    .get(ctrlDb.getStory)
    .put(authentication, ctrlDb.updateStory)
    .delete(authentication, ctrlDb.deleteStory)

router.route('/task')
    .post(ctrlDb.createTask)
router.route('/tasks')
    .get(ctrlDb.getTasks)
router.route('/task/:idTask')
    .get(ctrlDb.getTask)
    .put(authentication, ctrlDb.updateTask)
    .delete(authentication, ctrlDb.deleteTask)

router.route('/post')
    .post(ctrlDb.addPost)
router.route('/posts')
    .get(ctrlDb.getPosts)
router.route('/posts/project/:idProject')
    .get(ctrlDb.getPostsByProjectId)
router.route('/post/:idPost')
    .get(ctrlDb.getPost)
    .put(authentication, ctrlDb.updatePost)
    .delete(authentication, ctrlDb.deletePost)


router.route('/workLog')
    .post(ctrlDb.createWorkLog)
router.route('/workLogs')
    .get(ctrlDb.getWorkLogs)
router.route('/workLog/:idWorkLog')
    .get(ctrlDb.getWorkLog)
    .put(authentication, ctrlDb.updateWorkLog)
    .delete(authentication, ctrlDb.deleteWorkLog)

module.exports = router;
