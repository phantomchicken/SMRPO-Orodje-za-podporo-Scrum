const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    developers: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }],
    scrum_master: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    documentation: [{  // Add documentation field as an array of file names
        type: String
    }]
});

var Project = mongoose.model('Project', projectSchema, "Projects");
module.exports = Project;