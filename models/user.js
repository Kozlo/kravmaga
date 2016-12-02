const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    // TODO: understand if index is needed and check what else I might need
    // TODO: figure out what fields should go here and what should go to auth0
    auth0Id: { type: String, unique: true, required: true, index: true }
});

module.exports = mongoose.model('User', characterSchema);