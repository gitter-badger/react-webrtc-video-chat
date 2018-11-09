const initialState = {
    name: undefined,
    to: undefined,
    wsConnection: undefined,
    onlineUsersList: [],
    openList: true,

    localVideoStream: undefined,
    remoteVideoStream: undefined,
    peerConnection: undefined,
}

function sessionReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_WS':
        case 'SET_TO':
        case 'SET_FROM':
        case 'SET_LIST':
        case 'SET_NAME':
        case 'SET_PEER':
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
