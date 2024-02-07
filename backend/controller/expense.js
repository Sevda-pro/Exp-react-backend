const User = require('../models/signup'); 
const Expense = require('../models/expense'); 

const send = async (req, res) => {
    try {
        const obj = {
            amount: req.body.price,
            description: req.body.desc,
            category: req.body.category,
            userId: req.user._id 
        };

        
        await Expense.create(obj);

        
        let totalexp = Number(obj.amount) + Number(req.user.total_expense);

        
        await User.findByIdAndUpdate(req.user._id, {
            total_expense: totalexp
        });

        res.status(201).json({ message: "Expense added successfully", success: true, checkout: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const show = async (req, res) => {
    try {
        let result = await Expense.find({
            userId: req.user._id 
        });

        res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const erase = async (req, res) => {
    try {
        let i = req.params.id0;
        let exp = await Expense.findOne({ _id: i });
        let user = await User.findById(req.user._id);
        let total = Number(user.total_expense);

        await Expense.deleteOne({
            _id: i
        });

        await User.findByIdAndUpdate(req.user._id, {
            total_expense: total - Number(exp.amount)
        });

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const update = async (req, res) => {
    try {
        let exp = await Expense.findOne({ _id: req.params.id0 });
        let user = await User.findById(req.user._id);
        let total = Number(user.total_expense);

       
        await User.findByIdAndUpdate(req.user._id, {
            total_expense: total - Number(exp.amount)
        });

     
        let result = await Expense.updateOne({
            _id: req.params.id0
        }, {
            amount: req.body.price,
            description: req.body.desc,
            category: req.body.category
        });

       
        let user2 = await User.findById(req.user._id);
        let total2 = Number(user2.total_expense);

        await User.findByIdAndUpdate(req.user._id, {
            total_expense: total2 + Number(req.body.price)
        });

        res.status(200).json({ message: "Expense updated successfully", result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = { send, show, erase, update };
