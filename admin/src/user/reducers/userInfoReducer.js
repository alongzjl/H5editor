import * as types from '../actions/actionTypes';
const initialState = {
    user: {},
};

var userInfoReducer = function(state = initialState, action) {
    if(action.type === types.USERINFO_CHANGE){
        return {...state, user: action.user};
    }
    return state;
};

export {userInfoReducer as default}
