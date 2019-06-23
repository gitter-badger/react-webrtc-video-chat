import { useState, useEffect } from 'react';

export function useInput(initvalue='') {
    const [value, setValue] = useState(initvalue);

    const onChange = e => setValue(e.target.value);

    return {
        value,
        onChange,
    }
}

export function useUserMedia(constraints, errorCallback=(_=>undefined)) {
    const [stream, setStream] = useState();

    useEffect(_ => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(setStream)
            .catch(errorCallback)
    }, []);

    return stream;
}