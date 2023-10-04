const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const fs = require('fs');
const tf = require('@tensorflow/tfjs');

const nsfwjs = require('nsfwjs');
const { createCanvas, loadImage } = require('canvas');



let model;
nsfwjs.load().then((loadedModel) => {
  model = loadedModel;
  console.log('NSFW model loaded');
});


function isValidJSON(message) {
  try {
    JSON.parse(message);
    return true;
  } catch (error) {
    return false;
  }
}

async function processImage(imageData) {
  try {
    // Load the image using the 'canvas' library
    const image = await loadImage(imageData);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Classify the image
    const predictions = await model.classify(canvas);

    // Format the predictions
    const formattedPredictions = predictions.map((prediction) => {
      const probabilityDecimal = prediction.probability.toFixed(4);
      const probabilityPercent = (prediction.probability * 100).toFixed(2);
      return `${prediction.className}: ${probabilityDecimal} (${probabilityPercent}%)`;
    });

    return formattedPredictions;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('An error occurred while processing the image.');
  }
}




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

const imageToSend = []
const whoisthis = [];



const whoseImage = []

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
// Imagetosend is actually who to send it to

    //const imageToSend = []
//const whoseImage = []
if (message.includes('someonejustsentanimage')&& imageToSend.length == 0) {
  const messageWithoutCode = String(message).replace('someonejustsentanimage', '');
  imageToSend.push(messageWithoutCode)
  whoisthis.push(username)
  console.log("image about to be sent to "+ messageWithoutCode)
  ws.send('[image sent to '+messageWithoutCode+']')

}

else if (message.includes('someonejustsentanimage')&& imageToSend.length > 0) {

ws.send ('[something went wrong]')
// send message to another. keep  create waiting arrays like that. 50 mac. To handle 50 simultenous.  You tried man.

}


if (imageToSend.length > 0 && message instanceof Buffer && message.length > 50 && whoisthis[0] == username) {
  const value = imageToSend[0];
  console.log("image should be sent to "+ value)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const clientInfo = clients.get(client);
      if (clientInfo && clientInfo.username === value) {
        client.send('[image recieved from '+username+']')
        client.send(message);
        ws.send(message);

  imageToSend.length = 0;
  whoisthis.length = 0;
}
}
});
return
}


if (imageToSend.length > 0 && username !== 'controlbot587563' && username !== 'welcomepage'){
return
}
    const marker = 'image:';
    const secretInfo = 'someonejustsentanimage';
    if (message.length <= 50) {
    console.log(`Received: ${message}`);
    }
    if (message === 'disconnect') {
      // If the client sent a "disconnect" message, remove them from the clients map and broadcast a "Disconnected" message.
      const { username } = clients.get(ws);
      clients.delete(ws);
      const SECRETCODE2 = "XyZ1AbCdEfG2";
      // broadcast(`${username} left the chat`);
      broadcast(`${username} left ${SECRETCODE2}`);
    } 
    else if (isValidJSON(message)) {
      const jsonData = JSON.parse(message);
      const binaryData = jsonData.binaryData;
      
      // Convert the binaryData object to a Buffer
      const bufferData = Buffer.from(binaryData);
      
      // Create a unique filename (e.g., using a timestamp)
      const timestamp = Date.now();
      const filename = `image_${timestamp}.png`; // Use an appropriate file extension
      
      // Write the binary data to a file
      fs.writeFile(filename, bufferData, (err) => {
        if (err) {
          console.error('Error writing image file:', err);
          return;
        }
      
        console.log('Image saved as', filename);
        // Now you have saved the image on your server.
      });
    }
    
    
    
    
 
    else if (message instanceof Buffer && message.length > 50) {
      // Handle binary data (image) received from the client
      console.log('Received binary data with length > 50');


      processImage(message)
      .then((predictions) => {
        // Find the "Porn" prediction and its probability
        const pornPrediction = predictions.find(prediction => prediction.includes("Porn:"));
        if (pornPrediction) {
          const probabilityRegex = /([0-9.]+)%/;
          const pornProbability = parseFloat(probabilityRegex.exec(pornPrediction)[1]);
          if (pornProbability > 30) {
            // The "Porn" probability is over 30%, don't send the message
            console.log('Porn probability is over 30%, message not sent');
            ws.send('[nsfw detected]')
            setTimeout(() => {
              ws.close();
            }, 5000);
        
            return;
          }
        }
  
        // Send the predictions back to the client
    //    ws.send(JSON.stringify({ predictions }));
    broadcast(message);
      messageHistory.push(message)
      })
      .catch((error) => {
        console.error('Error processing image:', error);
        // Handle the error and potentially send an error response to the client
      });
  
  
  
  
  

      return
      
      // Send the binary data back to the original client
      broadcast(message);
      messageHistory.push(message)
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
                    if (messageWithoutUser.length>1){
                    client.send(`[PM from ${messageWithoutMention}]`);
                    ws.send(`[PM sent to @${mentionedUsername} ${messageWithoutUser}]`);
                  }
                  else{
                    ws.send(`[can't send empty message]`);
                    //ws.send(`[PM sent to @${mentionedUsername} ${messageWithoutUser}]`);
                  }
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
 // console.log('WebSocket server is listening on port 3000');
 console.log('server in listen mode');
});




