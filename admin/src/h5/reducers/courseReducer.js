import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    courses: [],
    course: {},
    total: 0,
};

const reducer = function (state = initialState, action) {
    if (action.type === types.COURSE_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.COURSE_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
};

export { reducer as default };
