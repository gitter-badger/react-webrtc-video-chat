import { EventEmitter } from "events";
import _ from 'lodash';
import { useEffect } from "react";

export default function useSignalConnection(endpoint='') {
    const emitter = new EventEmitter();

    useEffect(_ => {
        const ws = new WebSocket(endpoint);

        ws.onmessage = message => {
            let messageJson = JSON.parse(message.data);
            if (messageJson.type) {
                emitter.emit(messageJson.type, _.omit(messageJson, 'type'));
            }
        };
    
        emitter.send = data => {
            ws.send(JSON.stringify(data));
        };
    });

    return emitter;
}
