const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    auth_id: { type: String, unique: true, required: true, index: true },
    email: { type: String, index: true },
    is_admin: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    given_name: { type: String },
    family_name: { type: String },
    gender: { type: String },
    picture: { type: String }
});

module.exports = mongoose.model('User', userSchema);
