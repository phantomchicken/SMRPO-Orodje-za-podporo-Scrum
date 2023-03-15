const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    condensedValue: {
        type: String,
        required: true
    },
    randomValue: {
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
    email: {
        type: String,
        unique: true,
        required: true
    },
    privilege: {
        type: String,
        enum: ['normal', 'admin'],
        default: 'normal'
    },
    timestamp: {
        type: Date,
        default: ''
    },
    login_counter: {
        type: Number,
        default: 0
    }
});

userSchema.methods.setPassword = function (geslo) {
    this.randomValue = crypto.randomBytes(16).toString('hex');
    this.condensedValue = crypto
        .pbkdf2Sync(geslo, this.randomValue, 1000, 64, 'sha512')
        .toString('hex');
};

userSchema.methods.checkPassword = function (geslo) {
    let zgoscenaVrednost = crypto
        .pbkdf2Sync(geslo, this.randomValue, 1000, 64, 'sha512')
        .toString('hex');
    return this.condensedValue == zgoscenaVrednost;
};

userSchema.methods.generateJwt = function () {
    const datumPoteka = new Date();
    datumPoteka.setDate(datumPoteka.getDate() + 7); //tle bi lahko spremenili da seja potece hitreje nego kot 7 dni

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        privilege: this.privilege,
        timestamp: this.timestamp,
        login_counter: this.login_counter,
        exp: parseInt(datumPoteka.getTime() / 1000, 10)
    }, process.env.JWT_PASSWORD);
};

userSchema.statics.updateTimestamp = function updateTimestamp(id, callback) {
    return this.findByIdAndUpdate(id, { 'timestamp' : Date.now() }, { new : true }, callback);
 };

 userSchema.statics.incrementCounter = function updateTimestamp(id, callback) {
    return this.findByIdAndUpdate(id, { $inc: { "login_counter": 1 } }, { new : true }, callback);
 }

var User = mongoose.model('User', userSchema, "Users");
module.exports = User;