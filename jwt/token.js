const jwt = require('jsonwebtoken');
/**
 * Contains Java Web Token functionality: generate, verify
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class JwtToken {
  /**
   * Stores secret
   * @constructor
   * @param {object} config - jwt cofiguration object
   */
  constructor(config) {
    this._expiration = config.expiration;
    this._maxAge = config.maxAge;
    this._secret = config.secret;
    this._issuer = config.issuer;
  }

  /**
   * Generates encrypted token with user id and access level
   * Sets expiration time and sings it using secret
   * @param {number} personid - CERN user id
   * @param {string} username - CERN username
   * @param {number} access - level of access
   * @return {object} generated token
   */
  generateToken(personid, username, access) {
    const payload = {id: personid, username: username, access: access};
    const token = jwt.sign(payload, this._secret, {
      expiresIn: this._expiration,
      issuer: this._issuer
    });
    return token;
  }

  refreshToken(token) {
    try {
      const decoded = jwt.verify(token, this._secret, {
        issuer: this._issuer,
        ignoreExpiration: true,
        maxAge: this._maxAge
      });
      return this.generateToken(decoded.id, decoded.username, decoded.access);
    } catch(err) {
      return false;
    }
  }

  /**
   * Verifies user token using the same secret as in generateToken method
   * @param {object} token - token to be verified
   * @return {object} whether operation was successful, if so decoded data are passed as well
   */
  verify(token) {
    const decoded = jwt.verify(token, this._secret, {
      issuer: this._issuer
    });
    return decoded;
  }
};
