var express = require('express');
var router = express.Router();

/* GET home page. */
const ctrlDb = require('../controllers/db');

router.route('/')
    .get(ctrlDb.getUsers)
    .post(ctrlDb.addUser)

router.route('/user')
    .post(ctrlDb.register)

module.exports = router;