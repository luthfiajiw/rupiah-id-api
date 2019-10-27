const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

module.exports = (req, res, next) => {
  try {
    const token = isEmpty(req.query.token)
      ? req.headers.authorization.split(' ')[1]
      : req.query.token;
      
    const decoded = jwt.verify(token, 'secret');
    req.userData = decoded;
    next();
  } catch (e) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        message: 'Authentication failed.'
      }
    });
  }

};
