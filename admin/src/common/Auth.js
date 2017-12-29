/**
 * Created by sunlong on 16/8/3.
 */
import { hashHistory } from 'react-router';

const Base64 = require('js-base64').Base64;

export default class Auth {
    check = () => {
        if (!sessionStorage.user) {
            hashHistory.push('/user/login');
        }
    };

    logout = () => {
        sessionStorage.clear();
        hashHistory.push('/user/login');
    };

    login = (token, reload = false) => {
        sessionStorage.token = token;
        sessionStorage.user = Base64.decode(token.split('.')[1]);
        if (reload) {
            location.href = '#/template';
        } else {
            hashHistory.push('/template');
        }
    }
}
