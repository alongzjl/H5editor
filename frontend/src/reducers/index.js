import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import h5Reducer from './h5Reducer';
import uiReducer from './uiReducer';

const reducers = combineReducers({
    h5State: undoable(h5Reducer, {
        limit: 50,
        debug: true,
        filter: action => action.notRedoable !== true,
    }),
    uiState: uiReducer,
});

export default reducers;
