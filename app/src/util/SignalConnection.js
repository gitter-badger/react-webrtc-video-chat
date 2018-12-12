import { EventEmitter } from "events";

export default class SignalConnection extends EventEmitter {
    constructor (endpoint='') {
        super();
        this.ws = new WebSocket (endpoint);

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
