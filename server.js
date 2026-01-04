const http = require('http');

const PORT = 5000;

let requestCount = 0;

const server = http.createServer((req, res) => {
  console.log(req.url);

  switch (req.url) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Home Page</h1>');
      requestCount += 1;
      break;
    case '/students':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Students</h1>');
      requestCount += 1;
      break;
    case '/courses':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Courses</h1>');
      requestCount += 1;
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>404 Not Found</h1>');
      requestCount += 1;
  }

  res.write(`\n Request count: ${requestCount}`);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
