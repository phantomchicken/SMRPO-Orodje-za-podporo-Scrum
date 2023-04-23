const mongoose = require('mongoose');
const workLogSchema = new mongoose.Schema({
    task: {
        type: mongoose.Types.ObjectId,
        ref: "Task",
        required: True
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: True
    },
    startTime: {
        type: Date,
        required: true
    },
    stopTime: {
        type: Date,
        default: undefined
    },
});

var WorkLog = mongoose.model('WorkLog', workLogSchema, "WorkLogs");
module.exports = WorkLog;