import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import UserInfo from './user/components/UserInfo';
import Password from './user/components/Password';
import Account from './user/components/Account';
import User from './user/components/User';
import Login from './user/components/Login';
import Course from './h5/components/course/Course';
import Template from './h5/components/template/Template';
import Category from './h5/components/category/Category';
import Image from './h5/components/image/Image';
import Audio from './h5/components/audio/Audio';
import App from './common/App';
import store from './store';
import './common/main.css';

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Login} />
                <Route path="user/login" component={Login} />
                <Route path="user/info" component={UserInfo} />
                <Route path="user/password" component={Password} />
                <Route path="user/account" component={Account} />
                <Route path="user" component={User} />
                <Route path="course" component={Course} />
                <Route path="template" component={Template} />
                <Route path="image" component={Image} />
                <Route path="category/:type" component={Category} />
                <Route path="audio" component={Audio} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'),
);
