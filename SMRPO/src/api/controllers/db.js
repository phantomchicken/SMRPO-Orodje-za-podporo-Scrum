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

const register = (req, res) => {
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

        const new_user = new User();
        new_user.username = req.body.username;
        new_user.firstname = req.body.firstname;
        new_user.lastname = req.body.lastname;
        new_user.email = req.body.email;
        new_user.setPassword(req.body.password);
        new_user.privilege = "normal";

        new_user.save(error => {
            if (error) {
                if (error.name == "MongoError" && error.code == 11000) {
                    res.status(409).json({
                        "message": "User with that email already exists"
                    });
                } else {
                    res.status(500).json(error);
                }
            } else {
                res.status(201).json({
                    "token": new_user.generateJwt()
                });
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
    addUser: addUser,
    register: register
}