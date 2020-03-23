import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './state/reducer/reducer';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
<Router>
    <Provider store={store}>
        <App />
    </Provider>
</Router>
, document.getElementById('root'));
