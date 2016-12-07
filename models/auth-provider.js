const mongoose = require('mongoose');

const authProviderSchema = new mongoose.Schema({
    connection: { type: String, unique: true, required: true },
    is_social: { type: Boolean, required: true },
    provider: { type: String, required: true },
    user_id: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('AuthProvider', authProviderSchema);