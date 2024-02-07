const User = require('../models/signup.js')
const passwordReq = require('../models/passwordReq.js')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
require('dotenv').config()
const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const requestId = uuidv4();

        const user = await User.findOne({ email: email });;

        if (!user) {
            return res
                .status(404)
                .json({ message: "Please provide the registered email!" });
        }
        let obj = {
            id: requestId,
            isActive: true,
            userId: user._id,
        }
        const resetRequest = await passwordReq.create(obj);

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
            subject: "Expense Tracker Reset Password",
            textContent: "Link Below",
            htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
            <a href="${process.env.BASE_URL}/resetPassword/${params.requestId}"> Click Here</a>`,
            params: {
                requestId: requestId,
            },
        });
        return res.status(200).json({
            message:
                "Link for reset the password is successfully send on your Mail Id!",
        });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ error, message: "failed changing password" });
    }
};

const updatepassword = async (req, res) => {
    try {
        const id = req.params.id;

        let user = await passwordReq.findOne({ id: id });

        if (user) 
            user.updateOne({ active: false });
        const  newpassword  = req.body.password;
        console.log(newpassword)
        let find = await passwordReq.findOne({ id: id });

        if (find) {
            let user = await User.findOne({ _id: find.userId });
            if (user) {
                try {
                    if (!newpassword) {
                        return res.status(400).json({ error: "Invalid password format", success: false });
                    }

                    let salt = await bcrypt.genSalt(10);
                    console.log('Salt:', salt);

                    let hashedPassword = await bcrypt.hash(newpassword, salt);
                    console.log('Hashed Password:', hashedPassword);

                    // Update the user's password
                    await User.updateOne({ _id: find.userId }, { Password: hashedPassword });

                    res.status(201).json({ message: "Successfully updated the new password" });
                } catch (hashError) {
                    console.error(hashError);
                    return res.status(500).json({ error: "Error hashing the password", success: false });
                }
            } else {
                return res.status(404).json({ error: "User not found", success: false });
            }
        } else {
            return res.status(404).json({ error: "Password request not found", success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
};




module.exports = { forgotPassword, updatepassword };
