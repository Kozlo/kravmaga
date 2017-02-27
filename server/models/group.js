const mongoose = require('mongoose');
const { areMembersValid, isTextFieldValid } = require('../helpers/modelValidators');

/**
 * Schema properties.
 *
 * @property {String} name Group's name
 * @property {String[]} Group member (user) IDs
 */
const properties = {
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: isTextFieldValid,
            message: '{VALUE} is not a valid group name'
        }
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
