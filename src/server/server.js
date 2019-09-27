
const {onmessage} = require('./ws/onmessage');
const {onclose} = require('./ws/onclose');
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

var clients = [];
const nameMapData = {};

wss.on('connection', function connection(ws, req) {

    ws.on('message', function incoming(message) {
        var coming = onmessage(ws, clients, message);
        if (ws.name) {
            if (!nameMapData[ws.name]) {
                nameMapData[ws.name] = {
                    "puzzle": {"answers": []},
                    "bingo": {},
                };
            }
            var data = nameMapData[ws.name];
        }
    });

    ws.on('close', function close() {
        onclose(ws, clients);
    });

    // ws.send('something');

    // console.log('Connecting Request ', req);
    clients.push(ws);
    console.log('Total Connecting: ', clients.length);
});
