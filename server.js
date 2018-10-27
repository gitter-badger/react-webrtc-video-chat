const WebSocket = require('ws').Server;

const ws = new WebSocket({
    port: 8000,
});

ws.on('connection', socket => {
    socket.on('message', data => {
        console.log('received ', data);
        if (!data) return;
    });
});

ws.on('error', e => {
    console.error(e);
    process.exit(-1);
});
