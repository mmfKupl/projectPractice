const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const http = require('http');

const routers = require('./routers/routers');

const app = express();
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {

    //connection is up, let's add a simple simple event
    ws.on('message', message => {

        //log the received message and send it back to the client
        ws.send(`${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('{}');
});

app.use(routers);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});