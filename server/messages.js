module.exports = {

    clientList: list => JSON.stringify({
        type: 'list',
        list,
    }),

    error: (status, error) => JSON.stringify({
        status,
        error,
    }),

    signal: signal => JSON.stringify({
        type: 'signal',
        signal,
    }),

};
