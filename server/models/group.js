const mongoose = require('mongoose');
const { areMembersValid } = require('../helpers');

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
        type: [String],
        unique: false,
        default: [],
        validate: {
            validator: areMembersValid,
            message: '{VALUE} is not a valid array of unique member IDs!'
        }
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Group', schema);
