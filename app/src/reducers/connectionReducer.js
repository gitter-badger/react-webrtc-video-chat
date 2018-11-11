const initialState = {
    name: undefined,
    id: undefined,

    serverConnection: undefined,

    to: undefined,
    from: undefined,

    videoCall: undefined,
};

function connectionReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_NAME':
        case 'SET_ID':
        case 'SET_SERVER':
        case 'SET_VIDEOCALL':
        case 'SET_TO':
        case 'SET_FROM':
            return {
                ...state,
                ...action.payload,
            }

        default:
            return state;
    }
}

export default connectionReducer;
