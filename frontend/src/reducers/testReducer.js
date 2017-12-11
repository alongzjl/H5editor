import * as types from '../actions/actionTypes';
import {
    doChangeElementValue,
    changePageValue,
} from './reducerUtils';

// 重要： state 里面要保持都是immutablejs 对象
export default function (imState, action) {
    if (action.type === types.TEST_LINE_QUESTION_ADD) {
        return changePageValue(imState, 'elements', action.questions);
    }

    if (action.type === types.TEST_LINE_QUESTION_SORT_CHANGE) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));

        let newPage;
        if (action.sort === 'column') {
            const startLeft = 65;
            const startTop = 100;
            newPage = currentPage.update('elements', list => list.map(element => {
                if (element.get('name') === 'LineQuestionModal') {
                    const num = element.get('num');
                    let left = startLeft;
                    const top = num * startTop;
                    if (element.get('position') === 'right') {
                        left = startLeft + 150;
                    }
                    return element.set('style', element.get('style').merge({
                        left: `${left}px`,
                        top: `${top}px`,
                    }));
                }
                return element;
            }));
        } else {
            const startLeft = 35;
            const startTop = 100;
            newPage = currentPage.update('elements', list => list.map(element => {
                if (element.get('name') === 'LineQuestionModal') {
                    const num = element.get('num');
                    const left = startLeft + (100 * (num - 1));
                    let top = startTop;
                    if (element.get('position') === 'right') {
                        top = startTop + 100;
                    }
                    return element.set('style', element.get('style').merge({
                        left: `${left}px`,
                        top: `${top}px`,
                    }));
                }
                return element;
            }));
        }
        const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: { name: 'TestModal' } });
        return newState.toJS();
    }

    if (action.type === types.TEST_LINE_QUESTION_AUTO_SORT) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));

        let newPage;
        const length = currentPage.get('elements').size / 2;
        if (action.sort === 'column') {
            const startLeft = 65;
            const startTop = 100;
            const usedNum = [];
            newPage = currentPage.update('elements', list => list.map(element => {
                if (element.get('name') === 'LineQuestionModal') {
                    let num = element.get('num');
                    let left = startLeft;
                    if (element.get('position') === 'right') {
                        num = getRandomInt(1, length + 1, usedNum);
                        left = startLeft + 150;
                    }
                    const top = num * startTop;
                    return element.set('style', element.get('style').merge({
                        left: `${left}px`,
                        top: `${top}px`,
                    }));
                }
                return element;
            }));
        } else {
            const startLeft = 35;
            const startTop = 100;
            const usedNum = [];
            newPage = currentPage.update('elements', list => list.map(element => {
                if (element.get('name') === 'LineQuestionModal') {
                    let num = element.get('num');
                    let top = startTop;
                    if (element.get('position') === 'right') {
                        num = getRandomInt(1, length + 1, usedNum);
                        top = startTop + 100;
                    }
                    const left = startLeft + (100 * (num - 1));
                    return element.set('style', element.get('style').merge({
                        left: `${left}px`,
                        top: `${top}px`,
                    }));
                }
                return element;
            }));
        }
        const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: { name: 'TestModal' } });
        return newState.toJS();
    }

    if (action.type === types.TEST_CHOOSE_ADD) {
        return changePageValue(imState, 'elements', action.questions);
    }
    if (action.type === types.TEST_CHOOSE_ITEMS_ADD) {
        return changePageValue(imState, 'elements', action.questions);
    }
    if (action.type === types.TEST_FILL_SELECT_CHANGE) {
        return doChangeElementValue(imState, action.id, 'selectList', action.selectList);
    }
    if (action.type === types.TEST_FILL_ANSWERINDEX_CHANGE) {
        return doChangeElementValue(imState, action.id, 'answerIndex', action.answerIndex);
    }
    if (action.type === types.TEST_FILL_NUM_CHANGE) {
        return doChangeElementValue(imState, action.id, 'num', action.num);
    }

    /*  排序相关*/
    if (action.type === types.TEST_SORT_ANSWER_CHANGE) {
        return doChangeElementValue(imState, action.id, 'answer', action.answer);
    }
    if (action.type === types.TEST_SORT_ANSWER_STYLE_CHANGE) {
        return doChangeElementValue(imState, action.id, 'style', action.style);
    }
    if (action.type === types.TEST_SORT_ANSWER_SHOW_CHANGE) {
        return doChangeElementValue(imState, action.id, 'answerShow', action.answerShow);
    }

    if (action.type === types.TEST_SORT_QUESTION_STYLE_CHANGE) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const newPage = currentPage.update('elements', list => list.map(element => {
            if (element.get('name') === 'SortQuestionModal') {
                return element.set('style', element.get('style').merge(action.style));
            }
            return element;
        }));
        const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage) });
        return newState.toJS();
    }
    return imState.toJS();
}

function getRandomInt(min, max, usedNum) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const value = Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    if (usedNum.includes(value)) {
        return getRandomInt(min, max, usedNum);
    }
    usedNum.push(value);
    return value;
}
