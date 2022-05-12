const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.length = 0;
  }

  _transform(chunk, encoding, callback) {
    const newLength = this.length + chunk.byteLength;
    if (newLength > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.length = newLength;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
