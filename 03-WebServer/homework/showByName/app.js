var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor

http
  .createServer((req, res) => {
    const img = decodeURI(req.url);
    fs.readFile(`${__dirname}/images${img}.jpg`, (err, file) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Page not found!</h1>', 'utf-8');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(file, 'binary');
        res.end();
      }
    });
  })
  .listen(1337, '127.0.0.1');