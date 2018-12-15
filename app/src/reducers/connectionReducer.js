const initialState = {
    name: undefined,
    id: undefined,

    to: undefined,
    from: undefined,

    signal: undefined,
    videoCall: undefined,
};

function connectionReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_NAME':
        case 'SET_ID':
        case 'SET_TO':
        case 'SET_FROM':
        case 'SET_SIGNAL_CONNECTION':
        case 'SET_VIDEOCALL':
            return {
                ...state,
                ...action.payload,
            }

        case 'CALL_BY_ID':
            if (state.signal) {
                state.signal.send({
                    type: 'call',
                    to: action.payload,
                });
                
                return {
                    ...state,
                    to: action.payload,
                };
            }
            return state;
        break;

        default:
            return state;
    }
}

export default connectionReducer;
