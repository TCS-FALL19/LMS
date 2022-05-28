const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	designation: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Teacher", teacherSchema);
