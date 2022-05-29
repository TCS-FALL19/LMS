const mongoose = require("mongoose");

var result_schema = new mongoose.Schema({
  student: [
    {
      std: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      },
    },
  ],
  quiz: [
    {
      qid: { type: mongoose.Types.ObjectId, ref: "Quiz" },
    },
  ],
  assignment: [
    {
      aid: { type: mongoose.Types.ObjectId, ref: "Assignment" },
    },
  ],
});

module.exports = mongoose.model("Result", result_schema);
