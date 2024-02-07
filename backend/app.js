const express = require('express')
const app = express();
const cors = require('cors')
const Sib = require("sib-api-v3-sdk");
const User = require('./models/signup.js')
const Contact = require('./models/Contact.js')
const Expense = require('./models/expense.js')
const bodyParser = require("body-parser");
const expense_route=require('./routes/expense.js')
const password_route=require('./routes/forget.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connectDB = require('./db.js')
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use('/expense',expense_route)
app.use('/password',password_route)
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000
const authentication = async (req, res, next) => {
	try {

		const token = req.header("Authorization");
		// console.log(token);
		const { userId } = jwt.verify(token, "secretKey");
		// console.log(userId);
		let currUser = await User.findById(userId);
		req.user = currUser;
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: error });
	}
};
function generateAccessToken(id, premium) {
	let x = jwt.sign({ userId: id }, "secretKey");
	return x;
}
app.post('/', async (req, res) => {
	try {
		const { email } = req.body;
		let obj = await User.findOne({ email: email });
		if (obj) {
			res.status(409).json({ message: "email already exits", success: false });
		} else {
			let salt = await bcrypt.genSalt(10);
			let hashedPassword = await bcrypt.hash(req.body.password, salt);
			req.body.password = hashedPassword;

			let result = await User.create(req.body);
			res.status(201).json({ success: true, message: "Check your email for verification", user: result });
		}
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
})
app.post('/contact', async (req, res, next) => {
	try {
		let result = await Contact.create(req.body)
		res.status(200).json({ message: "We will get back to you within 48 hours.", success: true, result });
	} catch (error) {
		res.status(500).json({ message: error, success: false });
	}
})
app.get('/total',authentication, async (req, res, next) => {
	try {
		let user = await User.findOne({_id:req.user._id})
		res.status(200).json({result:user.total_expense });
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error, success: false });
	}
})
app.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		let obj = await User.findOne({ email: email });
		if (obj) {
			let passwordMatch = await bcrypt.compare(password, obj.password);
			if (passwordMatch) {
				res.status(200).json({ name: obj.name, message: "login successfull", success: true, token: generateAccessToken(obj._id) });
			} else {
				res.status(400).json({ success: false, message: "invalid password" });
			}
		} else {
			res.status(404).json({ success: false, message: "email does not exist" });
		}
	} catch (error) {
		res.status(500).json({ message: error, success: false });
	}
})
app.post('/check',async (req, res) => {
    try {
        const {email} = req.body;
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.API;
        console.log("Using API key:", apiKey.apiKey); 
        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: "mesahilsevda@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        const emailResponse = await transEmailApi.sendTransacEmail({
            sender,
            To: receivers,
            subject: "Registration NavLink",
            textContent: "NavLink Below",
            htmlContent: `<h3>Hi! We got the request from you. Here is the NavLink below >>></h3>
            <a href="${process.env.BASE_URL}/check/completed"> Click Here</a>`,
      });
        return res.status(200).json({
            message:
                "NavLink for registration is successfully send on your Mail Id!",
        });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ error,message: "failed registration" });
    }
});
app.get('/check/completed',async(req,res)=>{
	res.redirect(`${process.env.BASE_URL}/login`);
})

const apprun = () => {
	connectDB()
	app.listen(PORT);
}
apprun();