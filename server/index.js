const WebSocket = require('ws').Server;
const uuid = require('uuid/v1');

const MESSAGES = require('./messages');

const ws = new WebSocket({
    port: 8000,
});

ws.broadcast = function broadcast(data) {
    ws.clients.forEach(client => {
        client.send(data);
    });
};

ws.getSafeClientsList = function getClientsList() {
    let clist = Array.from (ws.clients);
    return clist.map(e => ({
        name: e.name,
        id: e.id,
    }));
};

ws.on('connection', socket => {
    socket.id = uuid();
    console.log('Connected: ', socket.id);

    socket.on('message', data => {
        console.log ('UUID: ', socket.id, ' ~ DATA: ', data);

        // parse string
        data = JSON.parse(data);

        switch (data.type) {
            case 'name':
                socket.name = data.name;
                ws.broadcast(MESSAGES.clientList(ws.getSafeClientsList ()));
            break;

            case 'list':
                socket.send(MESSAGES.clientList(ws.getSafeClientsList ()));
                console.log ('Sending : ', JSON.stringify (ws.getSafeClientsList ()));
            break;

            case 'signal':
                let receiver = Array.from (ws.clients).find(e => e.id == data.to);
                if (receiver) {
                    receiver.send(MESSAGES.signal(data.signal));
                } else {
                    socket.send(MESSAGES.error(404, 'No receiver with such ID found.'));
                }
            break;

            default:
                socket.send(MESSAGES.error(400, 'Bad Type.'));
        }
    });

    socket.on('error', console.error);
});

ws.on('error', e => {
    console.error(e);
    process.exit(-1);
});
