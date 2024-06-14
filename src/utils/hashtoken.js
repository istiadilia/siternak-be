const crypto = require('crypto');

function hashtoken(token) {
  return crypto.createHash('sha512').update(token).digest('hex');
}

module.exports = { hashtoken };
