const {send,show,erase,update} = require("../controller/expense");
const express = require("express");
const router = express.Router();
const jwt=require('jsonwebtoken');
const User=require('../models/signup')
const authentication = async (req, res, next) => {
	try {

		const token = req.header("Authorization");
		// console.log(token);
		const { userId } = jwt.verify(token, "secretKey");
		console.log(userId);
		let currUser = await User.findById(userId);
		req.user = currUser;
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: error });
	}
};
router.route("/").post(authentication,send);
router.route("/show").get(authentication,show);
router.route("/delete/:id0").delete(authentication,erase);
router.route("/update/:id0").put(authentication,update);


module.exports = router;