const initialState = {
    name: undefined,
    id: undefined,

    to: undefined,
    from: undefined,
    wsConnection: undefined,
    onlineUsersList: [],
    openList: true,

    localVideoStream: undefined,
    remoteVideoStream: undefined,
    videoCall: undefined,
}

function sessionReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_WS':
        case 'SET_TO':
        case 'SET_FROM':
        case 'SET_LIST':
        case 'SET_NAME':
        case 'SET_VIDEOCALL':
        case 'SET_LOCAL_STREAM':
        case 'SET_REMOTE_STREAM':
            return {
                ...state,
                ...action.payload,
            }

        case 'TOGGLE_LIST':
            return {
                ...state,
                openList: !state.openList,
            }

        default:
            return state;
    }
}

export default sessionReducer
