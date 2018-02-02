const common = {};

common.getAccessToken = function () {
    function getQueryString(name) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    let accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
        accessToken = getQueryString('access_token');
    }
    return accessToken;
};

export { common as default };
