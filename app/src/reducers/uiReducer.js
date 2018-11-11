const initialState = {
    onlineUsersList: [],
    openUsersList: true,

    openDebugDialog: false,
};

function uiReducer (state=initialState, action) {
    switch (action.type) {

        case 'SET_USER_LIST':
            return {
                ...state,
                ...action.payload,
            }

        case 'TOGGLE_USER_LIST':
            return {
                ...state,
                openUsersList: !state.openUsersList,
            }

        case 'TOGGLE_DEBUG_DIALOG':
            return {
                ...state,
                openDebugDialog: !state.openDebugDialog,
            }

        default:
            return state;
    }
}

export default uiReducer;
