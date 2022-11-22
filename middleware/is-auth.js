const jwt = require('jsonwebtoken')

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodeToken;
    try {
        decodeToken = jwt.verify(token, 'somesupersecretsecret');
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodeToken) {
        const error = new Error('Authentication fail');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodeToken.userId;
    next();
}