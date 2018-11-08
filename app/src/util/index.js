import { EventEmitter } from "events";
import _ from 'lodash';

export class SignalConnection extends EventEmitter {
    constructor () {
        this.ws = new WebSocket ('ws://localhost:8000');

        this.ws.onmessage = message => {
            let messageJson = JSON.parse(message);

            if (!messageJson.type) {
                this.emit('error', _.omit(messageJson, 'type'));
            }
        }
    }
}
