// errors/bad-req-err.js

class BadReqError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadReqError;
