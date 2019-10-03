const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    // accumulator for a text before EOF: write a, write b write c EOF
    this.acc = "";
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString();

    if (data.indexOf(os.EOL) !== -1) {
      // we want part of string before EOL and after
      const lineWithChunks = data.split(os.EOL);

      // add part before EOL to accumulator and dispatch it
      this.acc = this.acc + lineWithChunks.shift();
      callback(null, this.acc);

      // add remaining part to accumulator
      this.acc = lineWithChunks.join(os.EOL);
    } else {
      this.acc = this.acc + data;
      callback();
    }
  }

  _flush(callback) {
    // if there are any unflushed strings - dispatch them
    if (this.acc) {
      callback(null, this.acc);
    }
  }
}

module.exports = LineSplitStream;
