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

    SET_VIDEOCALL: videoCall => ({
        type: 'SET_VIDEOCALL',
        payload: {
            videoCall
        },
    }),

};
