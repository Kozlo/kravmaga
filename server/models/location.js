const mongoose = require('mongoose');
const { isTextFieldValid } = require('../helpers/modelValidators');

/**
 * Schema properties.
 *
 * @property {String} name Location's name
 */
const properties = {
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: isTextFieldValid,
            message: '{VALUE} is not a valid location name'
        }
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Location', schema);
