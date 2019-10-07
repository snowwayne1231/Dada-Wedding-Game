
const {onmessage, getData} = require('./ws/onmessage');
const {onclose} = require('./ws/onclose');

const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 80;

const clients = [];
const subscribers = [];

const index_file_path = path.resolve(__dirname + '/../../www/index.html');
const js_file_path = path.resolve(__dirname + '/../../www/app.js');
const css_file_path = path.resolve(__dirname + '/../../www/app.css');
const server_file_path = path.resolve(__dirname + '/server.html');
const dashboard_file_path = path.resolve(__dirname + '/dashboard.html');
const question_file_path = path.resolve(__dirname + '/question.html');

app.get('/', (req, res) => {
    res.sendFile(index_file_path);
});

app.get('/app.js', (req, res) => {
    res.sendFile(js_file_path);
});

app.get('/app.css', (req, res) => {
    res.sendFile(css_file_path);
});

app.get('/admin', (req, res) => {
    res.sendFile(server_file_path);
});

app.get('/dashboard', (req, res) => {
    res.sendFile(dashboard_file_path);
});

app.get('/question', (req, res) => {
    res.sendFile(question_file_path);
});

io.on('connection', function(socket){
    clients.push(socket);
    console.log(`a user [${socket.handshake.address}] connected: `, clients.length);

    socket.on('disconnect', function(){
        onclose(socket, clients);
        console.log(`a user [${socket.name}|${socket.handshake.address}] disconnected: `, clients.length);

        var subIdx = subscribers.findIndex(s => s == socket);
        if (subIdx>=0) {
            subscribers.splice(subIdx, 1);
        }
    });

    socket.on('message', function(msg){
        console.log('on message: ' + msg);
        var comingJSON = onmessage(socket, clients, msg);
        if (comingJSON.type === 'subscribe') {
            socket.emit('message', {
                type: 'subscribe',
                payload: getData(),
            });
            subscribers.push(socket);
        }
    });
});

http.listen(port, function(){
    console.log(`Server started, listening on *:${port}`);
});


setInterval(()=> {
    // console.log('subscribers', subscribers);
    subscribers.map(socket => {
        socket.emit('message', {
            type: 'subscribe',
            payload: getData(),
        });
    });
}, 3000);
