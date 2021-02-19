const { verifyToken } = require('./verify-token');

module.exports = async ({ req }) => {
    const token = (req.headers && req.headers.authorization) || '';
    const user = await verifyToken(token)
    return user;
}; 