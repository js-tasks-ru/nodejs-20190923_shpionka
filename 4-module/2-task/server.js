const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST":
      if (pathname.indexOf("/") > 0) {
        res.statusCode = 400;
        res.end();
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
      } else {
        const limitStream = new LimitSizeStream({ limit: 1048576 });
        const fileStream = fs.createWriteStream(filepath);

        req.pipe(limitStream).pipe(fileStream);

        req.on("close", () => {
          if (!req.complete) {
            fileStream.destroy();
            fs.unlinkSync(filepath);
          }
        });

        fileStream
          .on("close", () => {
            res.statusCode = 201;
            res.end("Success");
          })
          .on("error", error => {
            res.statusCode = 500;
            res.end("Cannot write a file");
          });

        limitStream.on("error", function(err) {
          console.log("limitStream:: on error ");
          res.statusCode = 413;
          res.end("Error");
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
