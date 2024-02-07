const mongoose = require("mongoose");
require('dotenv').config()
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.jrwj6nb.mongodb.net/ECOM`,
		);
		console.log(`MongoDB Connected`);
	} catch (error) {
		console.error("error is",error);
	}
};

module.exports = connectDB;

