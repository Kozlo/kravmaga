/**
 * Error handler.
 */

const errors = require('./config').errors;

module.exports = (err, req, res, next) => {
    const { name } = err;
    const statusCode = errors[name];
console.log(statusCode);
    if (typeof statusCode !== 'undefined') {
        console.error(`${name} error:`, err);
        res.status(statusCode).json(err);
    } else {
        res.status(500).json({
            message: 'An unexpected error occurred',
            error: err
        });
    }
};
