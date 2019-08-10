const crypto = require('crypto');

module.exports.buildRandStr = function(len) {
  if (!Number.isFinite(len)) {
    throw new TypeError('len need finite number');
  }
  return crypto.randomBytes(len).toString('hex').slice(0, len);
}