const mongoose = require('mongoose');
const storySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    storyPoints: {
        type: Number
    },
    priority: {
        type: String,
        enum: ['Must have', 'Could have', 'Should have', 'Won\'t have this time']
    },
    acceptanceCriteria: {
        type: String
    },
    businessValue: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Backlog', 'In Development', 'Code Review', 'Testing', 'Done'],
        default: 'Backlog'
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true
    },
    sprint: {
        type: mongoose.Types.ObjectId,
        ref: "Sprint",
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
});

var Story = mongoose.model('Story', storySchema, "Stories");
module.exports = Story;