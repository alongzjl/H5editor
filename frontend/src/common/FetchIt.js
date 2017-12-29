import 'whatwg-fetch';
import common from './common';

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
                if (result.msg === '登录已过期,请重新登录!' || result.msg === 'access_token不正确，请退出后重试') {
                   location.href = '#/login';
                }
                throw new Error(result.msg);
            }
        }).catch(error => {
            alert(error.message);
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

    static post(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${common.getAccessToken()}` },
            }, { body: config });
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static postFile(url, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'POST',
                headers: { Authorization: `Bearer ${common.getAccessToken()}` },
            }, config);
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

    static postJSON(url, data) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${common.getAccessToken()}` },
                body: JSON.stringify(data),
            });
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }

    static putJSON(url, data) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${common.getAccessToken()}` },
                body: JSON.stringify(data),
            });
            Fetch.remote(url, newConfig, resolve, reject);
        });
    }
}
