const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    story: {
        type: mongoose.Types.ObjectId,
        ref: "Story",
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    accepted: {
        type: Boolean,
        default: false
    },
    timeEstimate: {
        type: Number,
        required: true
    },
});

var Task = mongoose.model('Task', taskSchema, "Tasks");
module.exports = Task;