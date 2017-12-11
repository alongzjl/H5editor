import 'whatwg-fetch';
import { message } from 'antd';
import common from './common';

require('es6-promise').polyfill();
require('es6-object-assign').polyfill();

export default class Fetch {
    static remote(url, config, success, failed) {
        const defaultConfig = {
            method: 'GET',
        };
        const newConfig = Object.assign({}, defaultConfig, config);

        fetch(url, newConfig).then(response => response.json()).then(result => {
            if (result.success) {
                if (success) {
                    success(result.data);
                }
            } else {
                if (result.msg === '登录已过期,请重新登录!') {
                    location.href = '#/user/login';
                }
                throw new Error(result.msg);
            }
        }).catch(error => {
            message.error(error.message);
            if (failed) {
                failed(error);
            }
        });
    }

    static get(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'GET',
                headers: { Authorization: `Bearer ${common.getAccessToken()}` },
            }, config);
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static post(url, data) {
        let params = '';

        if (typeof data === 'object') {
            for (const key in data) {
                if (data[key] !== undefined) {
                    if (Array.isArray(data[key])) {
                        params += `${key}=${data[key].join(',')}&`;
                    } else {
                        params += `${key}=${encodeURIComponent(data[key])}&`;
                    }
                }
            }
        } else {
            params = data;
        }

        return new Promise((resolve, reject) => {
            const newConfig = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${common.getAccessToken()}` },
                body: params,
            };
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static put(url, data) {
        let params = '';

        if (typeof data === 'object') {
            for (const key in data) {
                if (data[key] !== undefined) {
                    params += `${key}=${encodeURIComponent(data[key])}&`;
                }
            }
        } else {
            params = data;
        }

        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${common.getAccessToken()}` },
                body: params,
            });
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static del(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${common.getAccessToken()}` },
            }, config);
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static postJSON(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${common.getAccessToken()}` },
            }, config);
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static putJSON(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${common.getAccessToken()}` },
            }, config);
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }
}
