const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	rollNo: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Admin", adminSchema);
