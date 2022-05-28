const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	teacherSche: {
		type: mongoose.Types.ObjectId,
		ref: "Teacher",
	},
	students: [
		{
			sid: {
				type: mongoose.Types.ObjectId,
				ref: "Student",
			},
		},
	],
});

module.exports = mongoose.model("Class", classSchema);
