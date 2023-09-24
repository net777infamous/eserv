const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the HTTP response header
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Write the response content
  res.end('WebSocket server is running');
});

// Create a WebSocket server by passing the HTTP server instance.
const wss = new WebSocket.Server({ server });

// Event handler for when a client connects to the WebSocket server.
wss.on('connection', (ws, req) => {
  // Handle WebSocket connections here
  console.log('Client connected');

  // Event handler for incoming messages from clients.
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Handle incoming messages from clients
  });

  // Event handler for when a client disconnects.
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Handle client disconnection
  });
});

// Specify the port for the server to listen on (port 3232 in this case)
const port = 3232;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`WebSocket server is listening on port ${port}`);
});
