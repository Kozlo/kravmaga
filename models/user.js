const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, required: true, index: true },
    isAdmin: { type: Boolean, default: false },
    email: { type: String, index: true },
    is_blocked: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    picture: { type: String }
});

module.exports = mongoose.model('User', userSchema);
