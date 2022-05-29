const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
	questions: [{type: String}],
	teacher: {
		type: mongoose.Types.ObjectId,
		ref: "Teacher",
	},
	class: String,
	subject: String,
	totalMarks: Number,
	submissionDate: String,
	submissions: [{
		student: {
			type: mongoose.Types.ObjectId,
			ref: "Student",
		},
		answers: [String],
		marks: Number,
	}],
});

module.exports = mongoose.model("Quiz", quizSchema);
