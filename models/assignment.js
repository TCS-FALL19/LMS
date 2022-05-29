var mongoose = require("mongoose");

var AssignmentSchema = mongoose.Schema(
  {
    teacher_id: {
      type: Number,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
    },
    deadline: {
      type: Date, //  YYYY-MM-DD
    },
    description: {
      type: String,
    },
    student_submissions: [
      {
        std_id: Number,
        filename: String,
        marks: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
