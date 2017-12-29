import * as types from './actionTypes';

export function addLineQuestion(questions) {
    return {
        type: types.TEST_LINE_QUESTION_ADD,
        questions,
    };
}

export function changeLineQuestionSort(sort) {
    return {
        type: types.TEST_LINE_QUESTION_SORT_CHANGE,
        sort,
    };
}

export function autoChangeLineQuestionSort(sort) {
    return {
        type: types.TEST_LINE_QUESTION_AUTO_SORT,
        sort,
    };
}

// 填空题相关
export function changeFillSelectList(id, selectList) {
    return {
        type: types.TEST_FILL_SELECT_CHANGE,
        id,
        selectList,
    };
}
export function changeFillAnswerIndex(id, answerIndex) {
    return {
        type: types.TEST_FILL_ANSWERINDEX_CHANGE,
        id,
        answerIndex,
    };
}
export function changeFillNum(id, num) {
    return {
        type: types.TEST_FILL_NUM_CHANGE,
        id,
        num,
    };
}
export function addChoose(questions) {
    return {
        type: types.TEST_CHOOSE_ADD,
        questions,
    };
}
export function addChooseItems(questions) {
    return {
        type: types.TEST_CHOOSE_ITEMS_ADD,
        questions,
    };
}

/* 排序题相关*/
export function changeSortAnswer(id, answer) {
    return {
        type: types.TEST_SORT_ANSWER_CHANGE,
        id,
        answer,
    };
}
export function changeSortAnswerStyle(id, style) {
    return {
        type: types.TEST_SORT_ANSWER_STYLE_CHANGE,
        id,
        style,
    };
}
export function changeSortAnswerShow(id, answerShow) {
    return {
        type: types.TEST_SORT_ANSWER_SHOW_CHANGE,
        id,
        answerShow,
    };
}

export function changeSortQuestionStyle(style) {
    return {
        type: types.TEST_SORT_QUESTION_STYLE_CHANGE,
        style,
        notRedoable: true,
    };
}

export function checkQuestion(checking) {
    return {
        type: types.TEST_CHECK,
        checking,
        notRedoable: true,
    };
}
