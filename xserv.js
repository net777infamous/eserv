const WebSocket = require('ws');
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
