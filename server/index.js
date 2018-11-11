const WebSocket = require('ws').Server;
const uuid = require('uuid/v1');

const _ = require('lodash');

const MESSAGES = require('./messages');

function log (id, data) {
    data = _.omit(data, 'signal')
    console.log ('*****');
    console.log ('RECEIVED FROM ', id);
    for (let i in data)
        console.log(i, ' : ', data [i]);
}

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
    socket.send(MESSAGES.sendId(socket.id));

    socket.on('message', data => {
        // parse string
        data = JSON.parse(data);
        log(socket.name ? socket.name : socket.id, data);

        switch (data.type) {
            case 'name':
                socket.name = data.name;
                ws.broadcast(MESSAGES.clientList(ws.getSafeClientsList ()));
            break;

            case 'list':
                socket.send(MESSAGES.clientList(ws.getSafeClientsList ()));
            break;

            case 'call':
                let r = Array.from (ws.clients).find(e => e.id == data.to);
                if (r)
                    r.send(MESSAGES.calling(data.to, socket.id));
                else
                    socket.send(MESSAGES.error(404, 'No receiver with such ID found.'));
            break;

            case 'signal':
                let receiver = Array.from (ws.clients).find(e => e.id == data.to);
                if (receiver)
                    receiver.send(MESSAGES.signal(data, socket.id));
                else
                    socket.send(MESSAGES.error(404, `No receiver with such ID found: ${data.to}`));
            break;

            default:
                socket.send(MESSAGES.error(400, `BadType: ${data.type}`));
        }
    });

    socket.on('error', console.error);
});

ws.on('error', e => {
    console.error(e);
    process.exit(-1);
});
