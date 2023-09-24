const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the HTTP response header
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Write the response content
  res.end('const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//const socket = new WebSocket(`ws://192.168.8.110:3000?username=controlbot587563`);
const socket = new WebSocket(`wss://eserv.onrender.com?username=controlbot587563`);

socket.on('open', () => {
  console.log('Connected to WebSocket server');

  // Display a menu and prompt for user input
  displayMenu();
});

socket.on('message', (message) => {
    if (message.includes('the chatters')){
 console.log(`Received from server: ${message}`);
    }
  //displayMenu();
});

socket.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

function displayMenu() {
  rl.question(
    'Enter a command (1 to send a notice, 2 to kick a user, 3 to list active users, or q to quit): ',
    (input) => {
      switch (input.trim()) {
        case '1':
          sendNotice();
          break;
        case '2':
          kickUser();
          break;
        case '3':
          listUsers();
          break;
        case 'q':
          rl.close();
          break;
        default:
          console.log('Invalid command. Please try again.');
          displayMenu();
      }
    }
  );
}

function sendNotice() {
  rl.question('Enter a notice message: ', (noticeMessage) => {
    const secretCode = 'Wjd7Hdk892Jmd';
    const messageToSend = `${secretCode} ${noticeMessage}`;
    socket.send(messageToSend);
    displayMenu()
  });
}

function kickUser() {
  rl.question('Enter the username to kick: ', (username) => {
    const secretCode = 'KJjdnIEW83HDn';
    const messageToSend = `${username} ${secretCode}`;
    socket.send(messageToSend);
    displayMenu()
  });
}

function listUsers() {
    const secretCode = 'DjDKj9xkjdJrn';
  const messageToSend = `List users ${secretCode}`;
  socket.send(messageToSend);
  displayMenu()
}

// Handle terminal input
rl.on('close', () => {
  socket.close();
  process.exit(0);
});
WebSocket server is running');
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
