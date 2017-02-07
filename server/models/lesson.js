const mongoose = require('mongoose');

/**
 * Lesson schema properties.
 *
 * @property {String} date Date
 * @property {String} group Target group
 * @property {String} location Location
 * @property {String} [attendees] Users that have indicated that they will attend the lesson
 * @property {String} [comment] Comment
 */
const properties = {
    date: {
        type: String,
        required: true
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
