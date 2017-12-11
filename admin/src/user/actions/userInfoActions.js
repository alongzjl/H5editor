import * as types from './actionTypes';
export function changeUser(user) {
    return {
        type: types.USERINFO_CHANGE,
        user: user
    };
}