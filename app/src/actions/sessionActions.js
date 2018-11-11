export default {

    SET_NAME: name => ({
        type: 'SET_NAME',
        payload: {
            name
        },
    }),

    SET_ID: id => ({
        type: 'SET_ID',
        payload: {
            id
        },
    }),

    SET_TO: to => ({
        type: 'SET_TO',
        payload: {
            to
        },
    }),

    SET_FROM: from => ({
        type: 'SET_FROM',
        payload: {
            from
        },
    }),

    SET_LOCAL_STREAM: localVideoStream => ({
        type: 'SET_LOCAL_STREAM',
        payload: {
            localVideoStream
        },
    }),

    SET_REMOTE_STREAM: remoteVideoStream => ({
        type: 'SET_REMOTE_STREAM',
        payload: {
            remoteVideoStream
        },
    }),

    SET_WS: wsConnection => ({
        type: 'SET_WS',
        payload: {
            wsConnection
        },
    }),

    SET_LIST: onlineUsersList => ({
        type: 'SET_LIST',
        payload: {
            onlineUsersList
        },
    }),

    SET_VIDEOCALL: videoCall => ({
        type: 'SET_VIDEOCALL',
        payload: {
            videoCall
        },
    }),

    TOGGLE_LIST: _ => ({
        type: 'TOGGLE_LIST',
    }),

};
