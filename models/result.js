const mongoose = require("mongoose");

var result_schema = new mongoose.Schema({
	student: {
		type: mongoose.Types.ObjectId,
		ref: "Student",
	},
	totalMarks: Number,
	acquiredMarks: Number,
	subject: String,
	cls: String,
});

module.exports = mongoose.model("Result", result_schema);
