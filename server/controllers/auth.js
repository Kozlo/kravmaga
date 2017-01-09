/**
 * Authentication controller.
 */

module.exports = {

    /**
     * Retrieves authentication-related config stored in environmental variables.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    getConfig(req, res) {
        const jwt_audience = process.env.JWT_AUDIENCE;
        const auth0_id = process.env.AUTH0_ID;

        if (!jwt_audience) return handleError(res, null, 'JWT_AUDIENCE environmental variable not set', 500);
        if (!auth0_id) return handleError(res, null, 'AUTH0_ID environmental variable not set', 500);

        res.status(200).json({ jwt_audience, auth0_id });
    }

};