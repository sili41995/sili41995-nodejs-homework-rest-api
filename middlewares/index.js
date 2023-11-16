const authenticate = require('./authenticate');
const isValidId = require('./isValidId');
const upload = require('./upload');
const validateBody = require('./validateBody');

module.exports = { validateBody, isValidId, authenticate, upload };
