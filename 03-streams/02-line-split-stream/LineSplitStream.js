const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastPartOfPrevChunk = Buffer.allocUnsafe(0);
  }
  _transform(chunk, encoding, callback) {
    chunk = Buffer.concat([this.lastPartOfPrevChunk, chunk]);
    let start = 0;
    let end = chunk.indexOf(os.EOL);
    while (end !== -1) {
      const buf = Buffer.allocUnsafe(end - start);
      chunk.copy(buf, 0, start, end);
      this.push(buf);
      start = end + 1;
      end = chunk.indexOf(os.EOL, start);
    }
    if (end !== chunk.byteLength) {
      this.lastPartOfPrevChunk = Buffer.allocUnsafe(chunk.byteLength - start);
      chunk.copy(this.lastPartOfPrevChunk, 0, start, chunk.byteLength);
    }
    callback();
  }
  _flush(callback) {
    if (this.lastPartOfPrevChunk.byteLength) {
      this.push(this.lastPartOfPrevChunk);
    }
    callback();
  }
}

module.exports = LineSplitStream;
