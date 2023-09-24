const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Create an HTTP server (you can also use Express or another HTTP server framework).
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});
// Create a WebSocket server by passing the HTTP server instance.
const wss = new WebSocket.Server({ server });

// Initialize an array to store connected clients and their last activity times.
const clients = new Map();

// Initialize an array to store chat message history.
const messageHistory = [];

// Function to send a message to all connected clients.
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to send chat message history to a specific client.
function sendHistoryToClient(client) {
  messageHistory.forEach((message) => {
    client.send(message);
  });
}

// Event handler for when a client connects to the WebSocket server.
wss.on('connection', (ws, req) => {
  console.log('Client connected');

  // Parse the query parameters from the request URL.
  const query = url.parse(req.url, true).query;
  const username = query.username || 'Anonymous'; // Use "Anonymous" as the default username.

  // Store the client's connection time.
  const connectionTime = new Date();

  // Store the client's username and connection time in the clients map.
  clients.set(ws, { username, connectionTime });

  const SECRETCODE = "5vP29KqR8mJn";

  // Broadcast a message to all clients when a new client connects.


  // Get a list of usernames connected (excluding the new user).
  const connectedUsernames = Array.from(clients.values())
    .map(client => client.username)
    .filter(name => name !== username);

    const SECRETCODE3 = "R8mJnXyZ1AbCd"; // A 12-character secret code

  // Send a message to the new user with the list of connected usernames.
  
  // Send chat message history to the new client.
  sendHistoryToClient(ws);
//  broadcast(`${username} joined the chat ${SECRETCODE}`);
//  ws.send(`the chatters: ${connectedUsernames.join(', ')} ${SECRETCODE3}`);

   wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(`${username} joined ${SECRETCODE}`);
    }
  });
  
  // Send a special message only to the joining client.
  ws.send(`you joined! ${SECRETCODE}`);

    if (connectedUsernames.length > 0) {
    ws.send(`the chatters: ${connectedUsernames.join(', ')} ${SECRETCODE3}`);
  } else {
    // Send a message indicating that the user is the only one in chat.
  //  ws.send(`no one else is here. invite with 'http://snap.talk4fun.net/' ${SECRETCODE3}`);
      ws.send(`no one else is here ${SECRETCODE3}`);
  }

  // Event handler for incoming messages from clients.
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    if (message === 'disconnect') {
      // If the client sent a "disconnect" message, remove them from the clients map and broadcast a "Disconnected" message.
      const { username } = clients.get(ws);
      clients.delete(ws);
      const SECRETCODE2 = "XyZ1AbCdEfG2";
      // broadcast(`${username} left the chat`);
      broadcast(`${username} left ${SECRETCODE2}`);
    } else {
      // Otherwise, broadcast the received message.
      const formattedMessage = `${message}`;
      broadcast(formattedMessage);
      messageHistory.push(formattedMessage);

      // Limit the message history to a certain number of messages (e.g., 100).
      if (messageHistory.length > 100) {
        messageHistory.shift(); // Remove the oldest message
      }
    }
  });

  // Event handler for when a client disconnects.
  ws.on('close', () => {
    console.log('Client disconnected');

    // Get the username of the disconnected client.
    const { username } = clients.get(ws);

    // Remove the client from the clients map.
    clients.delete(ws);

    const SECRETCODE2 = "XyZ1AbCdEfG2";
    // broadcast(`${username} left the chat`);
    broadcast(`${username} left ${SECRETCODE2}`);
  });
});










const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Event handler for terminal input.
rl.on('line', (input) => {
  if (input.trim() !== '') { // Check if the input is not empty after trimming whitespace.
    const parts = input.split(' ');
    if (parts.length === 2 && parts[0] === 'kick') {
      const usernameToKick = parts[1];

      // Find the WebSocket client associated with the specified username.
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const { username } = clients.get(client);
          if (username === usernameToKick) {
            let SECRETCODE4 = "R4v9YxK2wMjP";
            // Disconnect the specified user.
            broadcast(`${usernameToKick} has been disconnected ${SECRETCODE2}`);
            client.terminate(); // Terminate the WebSocket connection.
            
            // Send a message to the chat indicating that the user has been kicked.
           
          }
        }
      });
    } else {
      // Send the input from the terminal to all connected WebSocket clients.
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          let SECRETCODE4 = "R4v9YxK2wMjP";
          client.send(`Admin: ${input} ${SECRETCODE2}`);
        }
      });
    }
  }
});









/*

// Start the HTTP server on port 3000 (you can change the port as needed).
server.listen(3000, () => {
  console.log('WebSocket server is listening on port 3000');
});
*/
