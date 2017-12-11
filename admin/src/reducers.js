/**
 * Created by sunlong on 2017/6/16.
 */
import { combineReducers } from 'redux';

import userReducer from './user/reducers/userReducer';
import userInfoReducer from './user/reducers/userInfoReducer';

import templateReducer from './h5/reducers/templateReducer';
import courseReducer from './h5/reducers/courseReducer';
import audioReducer from './h5/reducers/audioReducer';
import imageReducer from './h5/reducers/imageReducer';
import categoryReducer from './h5/reducers/categoryReducer';

const reducers = combineReducers({
    courseState: courseReducer,
    templateState: templateReducer,
    userInfoState: userInfoReducer,
    userState: userReducer,
    audioState: audioReducer,
    categoryState: categoryReducer,
    imageState: imageReducer,
});

export default reducers;
