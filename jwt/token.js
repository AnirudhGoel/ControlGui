const jwt = require('jsonwebtoken');

module.exports = class JwtToken {

  constructor(secret) {
    this.secret = secret;
  }

  generateToken(userId, accessLevel) {
    const user = {id: userId, access: accessLevel};
    let token = jwt.sign(user, this.secret, {
      expiresIn: '2m'
    });
    return token;
  }

  verify(token) {
    if (!token) {
      return {
        success: false,
        message: 'Token not provided'
      };
    }
    try {
      let decoded = jwt.verify(token, this.secret);
      return {
        success: true,
        decoded: decoded
      };
    } catch(err) {
      return {
        success: false,
        message: err.name
      };
    }
  }
};
