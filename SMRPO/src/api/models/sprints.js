const mongoose = require('mongoose');
const sprintSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    velocity: {
        type: Number,
        required: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        //required: true // PUT BACK WHEN WE HAVE PROJECTS IN DB
    }
});

var Sprint = mongoose.model('Sprint', sprintSchema, "Sprints");
module.exports = Sprint;