const initialState = {
    name: undefined,
    id: undefined,

    to: undefined,
    from: undefined,

    signal: undefined,
};

function connectionReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_NAME':
        case 'SET_ID':
        case 'SET_TO':
        case 'SET_FROM':
        case 'SET_SIGNAL_CONNECTION':
            return {
                ...state,
                ...action.payload,
            }

        default:
            return state;
    }
}

export default connectionReducer;
