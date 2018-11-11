export const peerConnectionConfig = {
    // iceTransportPolicy: 'relay',
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                // 'stun:stun2.l.google.com:19302',
                // 'stun:stun3.l.google.com:19302',
                // 'stun:stun4.l.google.com:19302',
            ]
        },
    ],
};

export const videoConstrains = {
    video: {
        mandatory: {
            minWidth: 640,
            minHeight: 360,
        },
    },
    audio: true,
};
