module.exports = {

    clientList: list => JSON.stringify({
        type: 'list',
        list,
    }),

    calling: (to, from) => JSON.stringify({
        type: 'calling',
        to,
        from,
    }),

    sendId: id => JSON.stringify({
        type: 'id',
        id,
    }),

    error: (status, error) => JSON.stringify({
        type: 'error',
        status,
        error,
    }),

    signal: (data, from) => JSON.stringify({
        ...data,
        from,
    }),

};
