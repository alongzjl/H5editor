import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    users: [],
    user: {},
    total: 0,
};

const userReducer = function (state = initialState, action) {
    if (action.type === types.USER_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.USER_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
};

export { userReducer as default };
