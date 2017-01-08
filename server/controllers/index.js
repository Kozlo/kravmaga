/**
 * Main controller.
 */

const path = require('path');

module.exports = {

    /**
     * Sends the main index html file.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    main(req, res) {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    }

};