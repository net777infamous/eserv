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

const bannedClients = [];

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
 // console.log('Client connected');

  // Parse the query parameters from the request URL.
  const query = url.parse(req.url, true).query;
 // const username = query.username || 'Anonymous'; // Use "Anonymous" as the default username.
 const username = (query.username || 'Anonymous').toLowerCase();
  const clientIp = req.socket.remoteAddress.replace('::ffff:', '');
  const userIp = `${username}(${clientIp})`; 
  console.log('('+userIp+')'+' connected');


  if (bannedClients.includes(clientIp)) {
    console.log(`Banned client ('${username}') attempted to connect: ${clientIp}`);
    ws.close(); // Close the connection for banned clients


    setTimeout(() => {
      const index = bannedClients.indexOf(clientIp);
      if (index !== -1) {
        bannedClients.splice(index, 1); // Remove the IP address
        console.log(`Removed banned client: ${clientIp}`);
      }
    }, 300000);



    return;
  }





  // Store the client's connection time.
  const connectionTime = new Date();

  // Store the client's username and connection time in the clients map.
 // if(username !== 'controlbot587563'){
  if (username !== 'controlbot587563' && username !== 'welcomepage') {
  clients.set(ws, { username, connectionTime, userIp, clientIp});
  }

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
  //broadcast(`${username} joined the chat ${SECRETCODE}`);
  //ws.send(`You joined the chat ${SECRETCODE}`);

  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
     // if(username !== 'controlbot587563'){
      if (username !== 'controlbot587563' && username !== 'welcomepage') {
      //  console.log(username)
      client.send(`${username} joined ${SECRETCODE}`);
      }
    }
  });
  
  // Send a special message only to the joining client.
  ws.send(`you joined! ${SECRETCODE}`);
  
 // ws.send(`the chatters: ${connectedUsernames.join(', ')} ${SECRETCODE3}`);


  if (connectedUsernames.length > 0) {
    ws.send(`the chatters: ${connectedUsernames.join(', ')} ${SECRETCODE3}`);
  } else {
    // Send a message indicating that the user is the only one in chat.
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
    } 
    
    else if (message.includes('Wjd7Hdk892Jmd')) {
      const messageWithoutCode = String(message).replace('Wjd7Hdk892Jmd', '');
     // broadcast("ADMIN: "+messageWithoutCode.toUpperCase() +'R4v9YxK2wMjP')
      broadcast("admin: "+messageWithoutCode +'R4v9YxK2wMjP')
            }


            else if (message.includes('dfjJDJKE73KD')) {
             //clear history

             messageHistory.length = 0

                    }



          // Inside your message handling logic
          else if (message.includes('KJjdnIEW83HDn')) {
            // Remove 'KJjdnIEW83HDn' from the message
            const messageWithoutCode = String(message).replace('KJjdnIEW83HDn', '').trim(); // Trim any leading/trailing whitespace
          
            // Find and disconnect the client associated with the extracted IP address.
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                const clientInfo = clients.get(client);
                if (clientInfo && clientInfo.clientIp === messageWithoutCode) { // Check if clientInfo exists
                  // Disconnect the specified user.
                  let SECRETCODE2 = "XyZ1AbCdEfG2";
                  client.send(`disconnected ${SECRETCODE2}`);
                  client.terminate(); // Terminate the WebSocket connection.
          bannedClients.push(messageWithoutCode)
                  // Broadcast a message to the chat indicating that the user has been kicked.
                }
              }
            });
          }
          
          
          
          

            //  broadcast(`${messageWithoutCode} disconnected ${SECRETCODE2}`);
            else if (message.includes('DjDKj9xkjdJrn')) {
              const connectedUsernames = Array.from(clients.values())
              .map(client => client.userIp)
              .filter(name => name !== username);

              ws.send(`the chatters: ${connectedUsernames.join(', ')}`);
            }

            else if (message.includes('getIJijd38dshAKJ')) {
              const messageWithoutCode = String(message).replace('getIJijd38dshAKJ', '').trim();
              const connectedUsernames = Array.from(clients.values())
    .map(client => client.username)
    .filter(name => name !== username);
    console.log(messageWithoutCode +' is attempting to connect')
    if (connectedUsernames.includes(messageWithoutCode.toLowerCase())) {
      ws.send('denied');
      console.log(messageWithoutCode +' is denied connection')
    }
    else if (!connectedUsernames.includes(messageWithoutCode.toLowerCase())) {
      console.log(messageWithoutCode +' is granted connection')
      ws.send('granted');
    }

             
            }

            else if (message.includes('@')) {

              const mentions = String(message).match(/@(\w+)/g); // Extract all mentions
  
              if (mentions && mentions.length >= 2) {
                // Handle the case where there are two or more mentions
                // For example, you can send a message to the sender about multiple mentions.
                ws.send(`[forbidden action]`);
                return
              }

              // Extract the username mentioned in the message
              const mentionedUsername = String(message).split('@')[1].split(' ')[0].trim();
              if (mentionedUsername == username){
                ws.send('[forbidden action]')
                return
              }
              let userexist = false;
              // Remove the @username mention from the message
              const messageWithoutMention = String(message).replace(`@${mentionedUsername}`, '').trim();
              const messageWithoutUser = messageWithoutMention.replace(`${username}`, '').trim();
              
              // Find the WebSocket client associated with the mentioned username
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  const clientInfo = clients.get(client);
                  if (clientInfo && clientInfo.username === mentionedUsername) {
                    // Send the message only to the mentioned user without the mention
                    client.send(`[PM from ${messageWithoutMention}]`);
                    ws.send(`[PM sent to @${mentionedUsername} ${messageWithoutUser}]`);
                    console.log (username + ' sent a PM "'+ messageWithoutUser +'" to '+mentionedUsername)
                     userexist = true;
                  }
                }
              });
              if (userexist == false){
                ws.send('no such user')
              }
            }
            
            
            
            
            
    else {
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
    //console.log('Client disconnected');

    // Get the username of the disconnected client.
   // const { username } = clients.get(ws);
   const { username } = clients.get(ws) || {};


   const query = url.parse(req.url, true).query;
   const userIp = `${username}(${clientIp})`; 


   if(username !== undefined){

    console.log('('+userIp+')'+' disconnected');
    //console.log(username+' disconnected');

    // Remove the client from the clients map.
    clients.delete(ws);

    const SECRETCODE2 = "XyZ1AbCdEfG2";
    // broadcast(`${username} left the chat`);
    broadcast(`${username} left ${SECRETCODE2}`);
   }
   if(username == undefined){
    console.log('controlbot587563 or welcomepage disconnected');

   }

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
            let SECRETCODE2 = "XyZ1AbCdEfG2";
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
          let SECRETCODE2 = "XyZ1AbCdEfG2";
          client.send(`Admin: ${input} ${SECRETCODE2}`);
        }
      });
    }
  }
});
















// Start the HTTP server on port 3000 (you can change the port as needed).
server.listen(3000, () => {
  console.log('WebSocket server is listening on port 3000');
});




