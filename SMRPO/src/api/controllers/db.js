const mongoose = require('mongoose');
const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
require('./db');
const User = require('../models/users')
//const User = mongoose.model("User");


const getUser = (req, res) => {
    //console.log(req.params)
    User.findById(req.params.idUser).exec((error, user) => {
        console.log(user)
        if (!user) {
            return res.status(404).json({
                "message": "User not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(user);
        }
    });
}

const getUsers = (req, res) => {
    User.find({}, function (error, users) {
        if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(users)
            users.map((user) => {
                user.password = undefined;
                return user;
            });
            //console.log(users)
            res.status(200).json(users);
        }
    });
}

const register = (req, res) => {
    console.log(req.body);
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('firstname' in req.body &&
        'lastname' in req.body &&
        'username' in req.body &&
        'password' in req.body &&
        'email' in req.body)) {
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
        console.log(error)
        if (error) {
            if (error.name == "MongoServerError" && error.code == 11000) {
                res.status(409).json({
                    "message": "User with that username already exists!"
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

const login = (req, res) => {
    passport.authenticate('local', (error, user, informations) => {
        if (error)
            return res.status(500).json(error);
        else if (user) {
            return res.status(201).json({
                "token": user.generateJwt()
            });
        } else {
            return res.status(401).json(informations);
        }
    })(req, res);
};

const addUser = (req, res) => {
    console.log(req.body);
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('firstname' in req.body &&
        'lastname' in req.body &&
        'username' in req.body &&
        'password' in req.body &&
        'privilege' in req.body &&
        'email' in req.body)) {
        res.status(500).send('Missing argument')
        return;
    }

    User.insertMany([{ privilege: req.body.privilege, firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, password: req.body.password, email: req.body.email }],
        function (error, result) {
            if (error) {
                return res.status(500).json(error);
            } else {
                res.status(200).json(result);
            }
        });
}

const updateUser = (req, res) => {
    //console.log(req.body)
    //console.log(req.params)
    User.findById(req.params.idUser).exec((error, user) => {
        if (!user) {
            return res.status(404).json({
                "message": "No user found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            console.log(user)
            user.firstname = req.body.firstname;
            user.username = req.body.username;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.privilege = req.body.privilege
            if (req.body.password != null) user.setPassword(req.body.password);

            user.save((error, updated_user) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_user);
                }
            });
        }
    });
}

const deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.idUser).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}

module.exports =
{
    getUser: getUser,
    getUsers: getUsers,
    addUser: addUser,
    register: register,
    login: login,
    updateUser: updateUser,
    deleteUser: deleteUser
}