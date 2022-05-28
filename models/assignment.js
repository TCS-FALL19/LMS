var mongoose = require('mongoose');

var schema = mongoose.Schema;

var AssignmentSchema = mongoose.Schema({
    teacher_id: { 
        type: Number, 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    totalMarks: { 
        type: Number 
    },
    description: { 
        type: String
     },
    student_submissions: [{
        std_id: Number,
        filename: String,
        marks: Number
    }]
});

module.exports = mongoose.model('Assignment', AssignmentSchema);