const mongoose = require("mongoose");
const Expense = new mongoose.Schema({
	amount: {
		type: Number
	},
	description: {
		type: String,
	},
	category: {
		type: String,
	
	},
	id: {
		type: Number,  
		primaryKey: true,
		autoIncrement: true,
	},
	userId:{
		type:String
	}
});

module.exports = mongoose.model("Expense",Expense);
