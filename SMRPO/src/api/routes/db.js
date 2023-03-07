var express = require('express');
var router = express.Router();

/* GET home page. */
const ctrlDb = require('../controllers/db');

router.route('/')
    .get(ctrlDb.getUsers)
    .post(ctrlDb.addUser)

router.route('/user')
    .post(ctrlDb.register)

router.route('/user/login')
    .post(ctrlDb.login)

module.exports = router;