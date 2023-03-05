const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
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
    privilege: {
        type: String,
        enum: ['normal', 'admin'],
        default: 'normal'
    }
});

var User = mongoose.model('User', userSchema, "Users");
module.exports = User;