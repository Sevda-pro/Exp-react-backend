const mongoose = require('mongoose');

const passwordReq = new mongoose.Schema({
    id: {
        type: String,
        primary: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String
    }
});

module.exports = mongoose.model('passwordReq', passwordReq);