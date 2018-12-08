import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { StoreContext } from 'redux-react-hook';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import connectionReducer from './reducers/connectionReducer';
import uiReducer from './reducers/uiReducer';

import './index.css';
import 'animate.css';

import * as serviceWorker from './serviceWorker';

// ----- Enforce HTTPS

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
);

if (!isLocalhost && window.location.protocol !== 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

// -----

// redux
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store.
let appStore;
// TODO: Add environment check.
appStore = createStore(
    combineReducers({
        connection: connectionReducer,
        ui: uiReducer,
    }),
    composeEnhancer(applyMiddleware(thunk)),
    );

// -----

if (!navigator.mediaDevices.getUserMedia) {
    alert('Switch to chrome/ firefox');
}

// -----

ReactDOM.render(
    <StoreContext.Provider value={appStore}>
        <App />
    </StoreContext.Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
