import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    images: [],
    image: {},
    total: 1,
};

export default function (state = initialState, action) {
    if (action.type === types.IMAGE_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.IMAGE_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
}
