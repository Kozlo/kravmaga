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
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        unique: true,
        default: []
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Group', schema);
