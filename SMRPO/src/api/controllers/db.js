const mongoose = require('mongoose');
//const User = mongoose.model("User");

require('./db');
const User = require('../models/users')


const getData = (req, res) => {
    User.find({}, function (error, users) {
        if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(users)
            //res.status(200).json({ status: "OK" });
            res.status(200).json(users);
        }
    });
}

module.exports = {getData}