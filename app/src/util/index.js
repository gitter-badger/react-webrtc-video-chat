import { EventEmitter } from "events";
import _ from 'lodash';

export class SignalConnection extends EventEmitter {
    constructor () {
        super();
        this.ws = new WebSocket ('ws://localhost:8000');

        this.ws.onmessage = message => {
            let messageJson = JSON.parse(message.data);

            console.log ('Receiver: ', message.data);

            if (messageJson.type) {
                this.emit(messageJson.type, _.omit(messageJson, 'type'));
            }
        }
    }

    send (data) {
        this.ws.send(JSON.stringify(data));
    }
};
