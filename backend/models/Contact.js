const mongoose = require("mongoose");
const Contact = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	    required:true,
		unique: true,
	},
	message: {
		type: String,
	}
});

module.exports = mongoose.model("Contact", Contact);
