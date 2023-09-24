const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the HTTP response header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Write the response content
  res.end('Hello, World!\n');
});

// Specify the port for the server to listen on (port 3232 in this case)
const port = 3232;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
