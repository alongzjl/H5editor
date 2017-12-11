import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import 'normalize.css';
import 'animate.css';
import store from './store';
import Viewer from './components/h5/Viewer';
import './common/css/main.less';
import './common/css/flex.less';

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Viewer} />
            <Route path="/:id/:type" component={Viewer} />
        </Router>
    </Provider>,
    document.getElementById('content'),
);
