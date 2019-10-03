const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.count = 0;
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length + this.count >= this.limit) {
      callback(new LimitExceededError(), chunk);
    } else {
      this.count = this.count + chunk.length;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
