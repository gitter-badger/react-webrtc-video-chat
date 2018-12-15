const WebSocket = require('ws').Server;
const uuid = require('uuid/v1');
const http = require('http');

const _ = require('lodash');
const winston = require('winston');
const { createLogger, transports, format } = winston;
const { combine, timestamp, colorize, align, metadata, printf } = format;

const MESSAGES = require('./messages');

// ! HTTP SERVER -----

const server = http.createServer((req, res) => {
    res.write("WS server running!");
    res.end();
});

// ! LOGGER -----

const levels = {
    connection: 0,
    name: 0,
    call: 1,
    list: 2,
    signal: 2,
    error: 0,
    message: 3,
    sending: 5,
    other: 10,
};

const colors = {
    connection: 'green',
    name: 'green',
    call: 'blue',
    list: 'magenta',
    signal: 'cyan',
    message: 'yellow',
    sending: 'bgWhite',
    error: 'bgRed',
};

const myFormat = printf(info => (
                    `${info.timestamp} | ` +
                    `${info.metadata.id} ` +
                    `${info.metadata.to ? `-> ${info.metadata.to}` : ''} ` +
                    `${info.level}: ` +
                    `${info.message}`
                ));

winston.addColors(colors);

const logger = createLogger({
    level: 'other',
    levels,
    format: combine(
        colorize(),
        metadata(),
        align(),
        timestamp(),
        myFormat,
    ),
    transports: [
        new transports.Console(),
    ]
});

function logData (id, data) {
    // Always omit signal.
    data = _.omit(data, 'signal')
    logger.log(data.type, `From ${id}: ${JSON.stringify(data)}`);
}

// ! WS -----

const ws = new WebSocket({
    server,
});

ws.broadcast = data => {
    ws.clients.forEach(client => {
        client.send(data);
    });
};

ws.getSafeClientsList = () => {
    let clist = Array.from (ws.clients);
    return clist.map(e => ({
        name: e.name,
        id: e.id,
    }));
};

ws.on('connection', socket => {
    socket.id = uuid();
    logger.connection('Connected', {
        id: socket.name || socket.id
    });
    socket.send(MESSAGES.sendId(socket.id));

    socket.on('message', data => {
        // parse string
        try {
            data = JSON.parse(data);
        } catch(e) {
            logger.error(`400: Bad JSON`, {
                id: socket.name || socket.id,
            });
            socket.send(MESSAGES.error(400, `Bad JSON`));
            return;
        }

        printableData = JSON.stringify(_.omit(data, ['signal']));
        logger.message(printableData, {
            id: socket.name || socket.id
        });

        switch (data.type) {
            case 'name':
                socket.name = data.name;
                logger.list(printableData, {
                    id: socket.name || socket.id
                });
                ws.broadcast(MESSAGES.clientList(ws.getSafeClientsList ()));
            break;

            case 'list':
                logger.list(JSON.stringify(ws.getSafeClientsList ()), {
                    id: socket.name || socket.id
                });
                socket.send(MESSAGES.clientList(ws.getSafeClientsList ()));
            break;

            case 'call': {
                let r = Array.from (ws.clients).find(e => e.id == data.to);
                if (r) {
                    logger.call('Initiating Call', {
                        id: socket.name || socket.id,
                        to: r.name || r.id
                    });
                    r.send(MESSAGES.calling(data.to, socket.id));
                } else {
                    logger.error(`404: Call failed`, {
                        id: socket.name || socket.id,
                        to: r.name || r.id,
                    });
                    socket.send(MESSAGES.error(404, 'No receiver with such ID found.'));
                }
            }
            break;

            case 'signal': {
                let r = Array.from (ws.clients).find(e => e.id == data.to);
                if (r) {
                    logger.signal(`${r} -> ${data}`, {
                        id: socket.name || socket.id,
                        to: r.name || r.id
                    });
                    receiver.send(MESSAGES.signal(data, socket.id));
                } else {
                    logger.error(`404: Signal failed`, {
                        id: socket.name || socket.id,
                        to: r,
                    });
                    socket.send(MESSAGES.error(404, `No receiver with such ID found: ${data.to}`));
                }
            }
            break;

            default:
                logger.error(`400: Bad Message ${data.type}`, {
                    id: socket.name || socket.id,
                });
                socket.send(MESSAGES.error(400, `BadType: ${data.type}`));
        }
    });

    socket.on('close', event => {
        ws.broadcast(MESSAGES.clientList(ws.getSafeClientsList ()));
    });

    socket.on('error', console.error);
});

ws.on('error', e => {
    console.error(e);
    process.exit(-1);
});

// ! SERVER -----

server.listen(process.env.PORT || 8000);
console.log('Running!');
