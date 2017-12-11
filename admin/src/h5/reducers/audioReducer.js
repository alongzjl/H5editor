import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    audios: [],
    audio: {},
    total: 1,
};

export default function (state = initialState, action) {
    if (action.type === types.AUDIO_LIST_SUCCESS) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    if (action.type === types.AUDIO_CHANGE) {
        let newState = Immutable.fromJS(state);
        newState = newState.merge(action);
        return newState.toJS();
    }
    return state;
}
