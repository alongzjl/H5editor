import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const initialState = {
    noteModalHidden: true,
};

// 重要： state 里面要保持都是immutablejs 对象
export default function (state = initialState, action) {
    const imState = Immutable.fromJS(state);
    if (action.type === types.NOTE_MODAL) {
        return imState.set('noteModalHidden', action.hidden).toJS();
    }

    return state;
}
