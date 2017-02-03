const mongoose = require('mongoose');

/**
 * User schema properties.
 *
 * @property {String} name Group's name
 */
const properties = {
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Group', schema);
