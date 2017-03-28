/**
 * Main controller.
 */

const path = require('path');

module.exports = {
    /**
     * Route handler for all requests that haven't been matched by other route handlers.
     *
     * Sends the main index html file.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    getAll(req, res) {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    }
};
