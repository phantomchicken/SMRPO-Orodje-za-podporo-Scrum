const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

var Posts = mongoose.model('Post', postSchema, "Posts");
module.exports = Posts;
