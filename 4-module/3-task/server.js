const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "DELETE":
      if (pathname.indexOf("/") > 0) {
        res.statusCode = 400;
        res.end();
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end();
      } else {
        fs.unlink(filepath, error => {
          if (error) {
            res.statusCode = 500;
            res.end("Error");
          } else {
            res.statusCode = 200;
            res.end("Success");
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
