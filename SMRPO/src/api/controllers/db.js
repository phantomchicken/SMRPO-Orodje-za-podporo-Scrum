const mongoose = require('mongoose');
//const User = mongoose.model("User");

require('./db');
const User = require('../models/users')


const getUsers = (req, res) => {
    User.find({}, function (error, users) {
        if (error) {
            return res.status(500).json(error);
        } else {
            console.log(users)
            users.map((user) => {
                user.password = undefined;
                return user;
            });
            console.log(users)
            res.status(200).json(users);
        }
    });
}

const addUser = (req, res) => {
    console.log(req.body);
    if(req.body === undefined){
        res.status(500).send('Internal error')
        return;
    }

    if(! ('firstname' in req.body &&
          'lastname' in req.body && 
          'username' in req.body &&
          'password' in req.body &&
          'email' in req.body))        
        {
            res.status(500).send('Missing argument')
            return;
        }

    User.insertMany([{firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, password: req.body.password, email: req.body.email}], 
        function(error, result){
            if(error){
                return res.status(500).json(error);
            } else {
                res.status(200).json(result);
            }
    });
}

module.exports = 
{
    getUsers: getUsers, 
    addUser: addUser
}