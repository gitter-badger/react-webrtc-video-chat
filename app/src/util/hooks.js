import { useState } from 'react';

export function useInput(initvalue='') {
    const [value, setValue] = useState(initvalue);

    const onChange = e => setValue(e.target.value);

    return {
        value,
        onChange,
    }
}

export function useUserMedia(constraints, errorCallback=(()=>undefined)) {
    const [stream, setStream] = useState(null);

    const getUserMedia = navigator.mediaDevices.getUserMedia;
    if (!getUserMedia) return new Error('MediaStream not supported.');

    getUserMedia(constraints)
        .then(setStream)
        .catch(errorCallback);

    return stream;
}

