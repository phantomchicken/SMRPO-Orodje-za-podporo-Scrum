const mongoose = require('mongoose');
const workLogSchema = new mongoose.Schema({
    task: {
        type: mongoose.Types.ObjectId,
        ref: "Task",
        required: true
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
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
