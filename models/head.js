const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const headSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	rollNo: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Head", headSchema);
