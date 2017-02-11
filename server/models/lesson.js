const mongoose = require('mongoose');
const { isStartDateValid, isEndDateValid } = require('../helpers/modelValidators');

/**
 * Lesson schema properties.
 *
 * @property {String} start Starting date/time
 * @property {String} end Ending date/time
 * @property {String} group Target group
 * @property {String} location Location
 * @property {String} [attendees] Users that have indicated that they will attend the lesson
 * @property {String} [comment] Comment
 */
const properties = {
    start: {
        type: Date,
        required: true,
        validate: {
            validator: isStartDateValid,
            message: '{VALUE} is not a valid start date! It must be a date before the end date!'
        }
    },
    end: {
        type: Date,
        required: true,
        validate: {
            validator: isEndDateValid,
            message: '{VALUE} is not a valid end date! It must be a date after the start date!'
        }
    },
    group: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    attendees: {
        type: [String],
        default: []
    },
    comment: String
};

/**
 * Lesson schema config.
 *
 * @property {boolean} timestamps Flag showing if createdAt and updatedAt fields should be generated for each user
 */
const config = { timestamps: true };

const schema = new mongoose.Schema(properties, config);

module.exports = mongoose.model('Lesson', schema);
