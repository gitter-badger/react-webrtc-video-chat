import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import connectionReducer from './reducers/connectionReducer';
import uiReducer from './reducers/uiReducer';

import './index.css';
import 'animate.css';

import * as serviceWorker from './serviceWorker';

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

ReactDOM.render(
    <Provider store={appStore}>
        <App />
    </Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
