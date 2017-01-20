/**
 * Configurable properties used throughout the app.
 */
const httpStatusCodes = {
    ok: 200,
    created: 201,
    noContent: 204,
    movedPermanently: 301,
    notModified: 304,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
    notImplemented: 501,
    serviceUnavailable: 503
};

const errors = {
    'UnauthorizedError': httpStatusCodes.unauthorized,
    'ValidationError': httpStatusCodes.badRequest
};
module.exports = { httpStatusCodes, errors };