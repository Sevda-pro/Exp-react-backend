const mongoose = require("mongoose");
const Signup = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	    required:true,
		unique: true,
	},
	password: {
		type: String,
	},
	total_expense: {
		type: Number,  
    default: 0,  
	},
});

module.exports = mongoose.model("Signup", Signup);
