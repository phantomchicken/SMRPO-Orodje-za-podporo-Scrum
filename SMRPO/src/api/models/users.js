const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone_number: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    consendedValue: {
        type: String,
        required: true
    },
    randomValue: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String
    },
    location: {
        type: String
    },
    favourite_vehicles_ids: {
        type: [String]
    },
    is_admin: {
        type: Boolean,
        required: true
    }
});

var User = mongoose.model('User', userSchema, "Users");
module.exports = User;