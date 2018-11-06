const WebSocket = require('ws').Server;
const uuid = require('uuid/v1');

const ws = new WebSocket({
    port: 8000,
});

ws.on('connection', socket => {
    socket.id = uuid();
    console.log('Connected: ', socket.id);

    socket.on('message', data => {
        // parse string
        data = JSON.parse (data);

        switch (data.type) {
            case 'name':
                socket.name = data.name;
            break;

            case 'list':
                let clients = Array.from (ws.clients).map(e => ({
                    name: e.name,
                    id: e.id,
                }));
                socket.send(JSON.stringify(clients));
            break;

            case 'signal':
                let receiver = Array.from (ws.clients).find(e => e.id == data.to);
                if (receiver) {
                    console.log(data.signal, ' to ', rreceiver.id);
                    receiver.send(data.signal);
                } else {
                    sendErrorMessage(socket, 404, 'No receiver with such ID found.');
                }
            break;

            default:
                sendErrorMessage(socket, 400, 'Bad Type.');
        }
    });

    socket.on('error', console.error);
});

ws.on('error', e => {
    console.error(e);
    process.exit(-1);
});

// ---

function sendErrorMessage(socket, status, error) {
    socket.send(JSON.stringify({
        status,
        error,
    }));
};
