import * as types from './actionTypes';

export function changeUser(user) {
    return {
        type: types.USER_CHANGE,
        user,
    };
}

export function listUsers(users, total) {
    return {
        type: types.USER_LIST_SUCCESS,
        users,
        total,
    };
}
