import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';
import { Router, Route, hashHistory,IndexRoute } from 'react-router';
import 'normalize.css';
import 'animate.css';
import store from './store';
import App from './components/App';
import Login from './components/user/login';
import Builder from './components/h5/Builder';
import Template from './components/template/template';
import './common/css/main.less';
import './common/css/flex.less';

// const Builder = Loadable({
//     loader: () => import('./components/h5/Builder'),
//     loading() {
//         return <div>Loading...</div>;
//     },
// });
//
// const Login = Loadable({
//     loader: () => import('./components/user/Login'),
//     loading() {
//         return <div>Loading...</div>;
//     },
// });
//
// const Template = Loadable({
//     loader: () => import('./components/template/template'),
//     loading() {
//         return <div>Loading...</div>;
//     },
// });
  
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
             <IndexRoute component={Template}/>  
				 				<Route path="builder" component={Builder} /> 
                <Route path="login" component={Login} /> 
                <Route path="template" component={Template} /> 
            </Route>
        </Router> 
    </Provider>,
    document.getElementById('content'),
);
