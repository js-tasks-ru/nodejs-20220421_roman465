const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

(function prepareDirectories() {
  const filesDirName = path.join(__dirname, 'files');
  if (!fs.existsSync(filesDirName)) {
    fs.mkdirSync(filesDirName);
  }
})();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const limitSize = 1000000;
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
      } else {
        const stream = fs.createWriteStream(filepath);
        stream.on('error', () => {
          res.statusCode = 500;
          res.end();
        });
        stream.on('finish', () => {
          res.statusCode = 201;
          res.end();
        });
        const limitStream = new LimitSizeStream({limit: limitSize});
        limitStream.on('error', (error) => {
          stream.destroy();
          if (error.code === 'LIMIT_EXCEEDED') {
            fs.rm(filepath, (error) => {
              if (error) {
                res.statusCode = 500;
                res.end();
              }
              res.statusCode = 413;
              res.end();
            });
          }
        });
        req.on('error', (error) => {
          stream.destroy();
          limitStream.destroy();
          fs.rm(filepath, (error) => {
            if (error) {
              res.statusCode = 500;
              res.end();
            }
          });
        });
        req.pipe(limitStream).pipe(stream);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
