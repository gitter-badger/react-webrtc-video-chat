import { EventEmitter } from "events";
import _ from 'lodash';

export default class SignalConnection extends EventEmitter {
    constructor () {
        super();
        this.ws = new WebSocket ('wss://shakal-io-signal.herokuapp.com/');

        this.ws.onmessage = message => {
            let messageJson = JSON.parse(message.data);

            if (messageJson.type) {
                this.emit(messageJson.type, _.omit(messageJson, 'type'));
            }
        }
    }

    send (data) {
        this.ws.send(JSON.stringify(data));
    }
};
