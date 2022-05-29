const mongoose = require("mongoose");

var assignment_schema = new mongoose.Schema({
  questions: [String],
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
  },
  class: String,
  subject: String,
  totalMarks: Number,
  submissionDate: String,
  submissions: {
    student: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    answers: [String],
    marks: Number,
  },
});

module.exports = mongoose.model("Assignment", assignment_schema);
