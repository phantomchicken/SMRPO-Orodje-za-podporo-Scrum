const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
const mongoose = require('mongoose');
//const User = mongoose.model('User','Users');
const User = require('../models/users')


passport.use(
  new LokalnaStrategija(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, pkKoncano) => {
      console.log(username,password)
      User.findOne(
        { username: username },
        (error, user) => {
          console.log(user)
          if (error)
            return pkKoncano(error);
          if (!user) {
            return pkKoncano(null, false, {
              "message": "Username not found"
            });
          }
          if (!user.checkPassword(password)) {
            return pkKoncano(null, false, {
              "message": "Password not correct"
            });
          }
          return pkKoncano(null, user);
        }
      );
    }
  )
);