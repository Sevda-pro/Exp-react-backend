const { forgotPassword, updatepassword } = require("../controller/forget");
const express = require("express");
const router = express.Router();
router.route('/fp').post(forgotPassword);
router.route('/updatepassword/:id').post(updatepassword)


module.exports = router;