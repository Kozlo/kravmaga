const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    auth_client_id: { type: String, unique: true, required: true, index: true },
    is_blocked: { type: Boolean, default: false },
    // TODO: figure out if it's possible to select Array item type (AuthProvider in this case
    auth_providers: { type: Array },
    email: { type: String, unique: true, index: true },
    name: {
        first: { type: String },
        last: { type: String },
    },
    gender: { type: String },
    picture: { type: String }
});

module.exports = mongoose.model('User', characterSchema);