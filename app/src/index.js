import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import sessionReducer from './reducers/sessionReducer';
import thunk from 'redux-thunk';

import './index.css';
import * as serviceWorker from './serviceWorker';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store.
let sessionStore;
// TODO: Add environment check.
sessionStore = createStore(
    sessionReducer,
    composeEnhancer(applyMiddleware(thunk)),
    );

ReactDOM.render(
    <Provider store={sessionStore}>
        <App />
    </Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
