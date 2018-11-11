export default {

    SET_USER_LIST: onlineUsersList => ({
        type: 'SET_USER_LIST',
        payload: {
            onlineUsersList
        },
    }),

    TOGGLE_USER_LIST: _ => ({
        type: 'TOGGLE_USER_LIST',
    }),

    TOGGLE_DEBUG_DIALOG: _ => ({
        type: 'TOGGLE_DEBUG_DIALOG'
    }),

};
