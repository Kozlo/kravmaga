/**
 * Configurable properties used throughout the app.
 */

const userConfig = {
    minPasswordLength: 5,
    roles: ['admin', 'user']
};

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

const errorNames = {
    badRequestError: 'BadRequestError',
    unauthorizedError: 'UnauthorizedError',
    validationError: 'ValidationError',
    forbiddenError: 'ForbiddenError'
};

const errorStatusCodes = {
    'UnauthorizedError': httpStatusCodes.unauthorized,
    'ValidationError': httpStatusCodes.badRequest,
    'ForbiddenError': httpStatusCodes.forbidden,
    'BadRequestError': httpStatusCodes.badRequest
};

module.exports = { httpStatusCodes, errorNames, errorStatusCodes, userConfig };
