// errors/not-auth-err.js

class NotAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = NotAuthError;
