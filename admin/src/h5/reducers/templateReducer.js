import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    templates: [],
    template: {},
    total: 0,
};

const adReducer = function (state = initialState, action) {
    if (action.type === types.TEMPLATE_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.TEMPLATE_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
};

export { adReducer as default };
