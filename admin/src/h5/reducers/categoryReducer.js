import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    categories: [],
    category: {},
    total: 0,
};

const reducer = function (state = initialState, action) {
    if (action.type === types.CATEGORY_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.CATEGORY_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
};

export { reducer as default };
