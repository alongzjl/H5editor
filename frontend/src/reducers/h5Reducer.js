import Immutable from 'immutable';
import * as types from '../actions/actionTypes';
import BaseModal from '../components/h5/modal/BaseModal';
import testReducer from './testReducer';
import {
    doChangeElementValue,
    changeElementValue,
    changePageValue,
    newIds,
    sortElements,
    changeMultiElementValue,
} from './reducerUtils';

const initialState = {
    courseId: null,
    name: '',
    templateId: null,
    templateName: '',
    pages: [],
    currentPage: 0,
    focus: {},
    selects: [],
};

// 重要： state 里面要保持都是immutablejs 对象
export default function (state = initialState, action) {
    const imState = Immutable.fromJS(state);
    if (action.type === types.PAGE_ADD) {
        const pages = imState.get('pages');
        const currentPage = imState.get('currentPage') + 1;
        const newPages = pages.insert(imState.get('currentPage') + 1, action.page);
        return imState.merge({ pages: newPages, currentPage }).toJS();
    }
    if (action.type === types.PAGE_DELETE) {
        const pages = imState.get('pages');
        const pageNo = pages.findIndex(item => item.get('id') === action.id);
        const newPages = pages.filter(item => item.get('id') !== action.id);
        return imState.merge({ pages: newPages, currentPage: (pageNo - 1 < 0 ? 0 : pageNo - 1) }).toJS();
    }

    if (action.type === types.PAGE_COPY) {
        const pages = imState.get('pages');
        const index = pages.findIndex(item => item.get('id') === action.id);
        const page = newIds(pages.get(index));
        const newPages = pages.insert(index + 1, page);
        return imState.merge({ pages: newPages, currentPage: index + 1 }).toJS();
    }

    if (action.type === types.PAGE_SORT) {
        const pages = imState.get('pages');
        const page = pages.get(action.oldIndex);
        const newPages = pages.delete(action.oldIndex).insert(action.newIndex, page);
        return imState.merge({ pages: newPages, currentPage: action.newIndex, focus: {} }).toJS();
    }

    if (action.type === types.PAGE_RENAME) {
        const pages = imState.get('pages');
        const newPages = pages.map(item => {
            if (item.get('id') === action.id) {
                return item.merge({
                    title: action.title,
                    editable: false,
                });
            }
            return item;
        });
        return imState.set('pages', newPages).toJS();
    }

    if (action.type === types.PAGE_INIT) {
        return imState.merge({ pages: [action.page], selects: [], currentPage: 0 }).toJS();
    }

    if (action.type === types.PAGE_EDITABLE_CHANGE) {
        const pages = imState.get('pages');
        const newPages = pages.map(item => {
            if (item.get('id') === action.id) {
                return item.set('editable', true);
            }
            return item.set('editable', false);
        });
        return imState.set('pages', newPages).toJS();
    }

    if (action.type === types.ELEMENT_ADD) {
        return changePageValue(imState, 'elements', ...action.elements);
    }

    if (action.type === types.ELEMENT_DELETE) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const focus = imState.get('focus');
        let ids = [focus.get('id')];
        if (focus.get('name') === 'LineQuestionModal') {
            ids.push(focus.get('to'));
        }
        if (focus.get('name') === 'FillBlanksModal') {
            if (action.id !== '') {
                ids = [action.id];
            }
        }
        let newElements = currentPage.get('elements').filter(element => !ids.includes(element.get('id')));
        newElements = newElements.filter(element => !imState.get('selects').includes(element.get('id')));
        const newPage = currentPage.set('elements', newElements);
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }

    if (action.type === types.ELEMENT_DELETE_ID) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const ids = action.id;

        const newElements = currentPage.get('elements').filter(element => !ids.includes(element.get('id')));
        const newPage = currentPage.set('elements', newElements);
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }

    if (action.type === types.ELEMENT_COPY) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const newPage = currentPage.update('elements', list => list.push(imState.get('focus').set('id', new BaseModal().generateId())));
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }

    if (action.type === types.PAGE_STYLE_CHANGE) {
        return changePageValue(imState, 'style', action.style);
    }

    if (action.type === types.FOCUS_CHANGED) {
        return imState.merge({ focus: action.focus, selects: [] }).toJS();
    }

    if (action.type === types.STYLE_CHANGE) {
        return changeMultiElementValue(imState, 'style', action.style);
    }

    if (action.type === types.ANIMATION_CHANGE) {
        return changeElementValue(imState, 'animations', action.animation, action.index);
    }

    if (action.type === types.ANIMATION_ADD) {
        return changeElementValue(imState, 'animations', [action.animation]);
    }

    if (action.type === types.ANIMATION_DELETE) {
        return changeElementValue(imState, 'animations', null, action.index);
    }

    if (action.type === types.ANIMATION_REFRESH) {
        return imState.merge({ focus: { id: -1 }, selects: [] }).toJS();
    }

    if (action.type === types.WORD_EDITABLE_CHANGE) {
        return doChangeElementValue(imState, action.id, 'contenteditable', action.editable);
    }
    if (action.type === types.WORD_TEXT_CHANGE) {
        // 因为排序题也是放在word里面，所以当word的文本变化的时候，需要处理sort
        const newState = resetSort(imState);
        return doChangeElementValue(newState, action.id, 'text', action.text);
    }
    if (action.type === types.WORD_PINYIN_CHANGE) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const elements = currentPage.get('elements');
        const elementId = imState.get('focus').get('id');
        const index = elements.findIndex(element => element.get('id') === elementId);
        if (index === -1) {
            return imState.toJS();
        }
        const newElement = elements.get(index).set('pinyins', action.pinyin);
        const newPage = currentPage.set('elements', elements.set(index, newElement));
        const newState = imState.set('pages', pages.set(imState.get('currentPage'), newPage));
        return newState.toJS();
    }

    if (action.type === types.WORD_FONT_FACE_CHANGE) {
        return changeElementValue(imState, 'fontFace', action.fontFace);
    }

    if (action.type === types.WORD_ACCESS_KEY_CHANGE) {
        return changeElementValue(imState, 'accessKey', action.accessKey);
    }

    if (action.type === types.WORD_SYMBOL_CHANGE) {
        return changeElementValue(imState, 'symbol', action.symbol, action.index);
    }
    if (action.type === types.WORD_SYMBOL_TOGGLE) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));

        const focus = imState.get('focus');
        let newElement = focus;
        const newPage = currentPage.update('elements', list => list.map(element => {
            if (element.get('id') === focus.get('id')) {
                const symbol = focus.get('symbol');
                if (symbol && symbol.size > 0) { // 如果当前存在symbol
                    if (action.symbol === symbol.get(0).get('symbol')) { // 并且是点击了同样的symbol，则取消
                        const textArr = symbol.map(symbolItem => symbolItem.get('text'));
                        newElement = element.merge({ symbol: [], text: textArr.join('\n') });
                        return newElement;
                    }  // 更换symbol
                    newElement = element.update('symbol', items => items.map(item => ({ symbol: action.symbol, text: item.get('text') })));
                    return newElement;
                }
                newElement = element.merge({ symbol: [{ symbol: action.symbol, text: focus.get('text') }], pinyin: false });
                return newElement;
            }

            return element;
        }));
        return imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: newElement }).toJS();
    }
    if (action.type === types.IMAGE_CHANGE) {
        return changeElementValue(imState, 'src', action.src);
    }
    if (action.type === types.VIDEO_CHANGE) {
        return changeElementValue(imState, 'code', action.code);
    }
    if (action.type === types.SHAPE_CHANGE) {
        return changeElementValue(imState, 'shapeName', action.shapeName);
    }

    if (action.type === types.CURRENTPAGE_CHANGE) {
        return imState.merge({ currentPage: action.index, focus: {} }).toJS();
    }

    if (action.type === types.NOTE_CHANGE) {
        return changeElementValue(imState, 'text', action.note.text);
    }

    if (action.type === types.ELEMENT_MOVE_DOWN) {
        const generator = sortElements(imState);
        const [index] = generator.next().value;
        const result = generator.next([index - 1, 0]); // 0是最下层
        if (result.value) {
            return result.value;
        }
    }

    if (action.type === types.ELEMENT_MOVE_UP) {
        const generator = sortElements(imState);
        const [index, length] = generator.next().value;
        const result = generator.next([index + 1, length - 1]); // length-1是最上层
        if (result.value) {
            return result.value;
        }
    }

    if (action.type === types.ELEMENT_MOVE_UP_MOST) {
        const generator = sortElements(imState);
        const [index, length] = generator.next().value;
        const result = generator.next([length - 1, length - 1]); // length-1是最上层
        if (result.value) {
            return result.value;
        }
    }

    if (action.type === types.ELEMENT_MOVE_DOWN_MOST) {
        const generator = sortElements(imState);
        generator.next();
        const result = generator.next([0, 0]); // 0是最下层
        if (result.value) {
            return result.value;
        }
    }

    if (action.type === types.TEMPLATE_CHANGE) {
        if (action.pages) {
            return imState.merge({ templateId: action.templateId, templateName: action.name, pages: action.pages, currentPage: 0 }).toJS();
        }
        return imState.merge({ templateId: action.templateId, templateName: action.name }).toJS();
    }

    if (action.type === types.COURSE_CHANGE) {
        if (action.pages) {
            return imState.merge({ courseId: action.courseId, pages: action.pages, templateId: action.templateId, currentPage: 0 }).toJS();
        }
        return imState.set('courseId', action.courseId).toJS();
    }

    if (action.type === types.PAGE_REPLACE) {
        const pages = imState.get('pages');
        const newPage = newIds(Immutable.fromJS(action.page));
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }

    if (action.type === types.ELEMENT_VISIBILITY_CHANGE) {
        return doChangeElementValue(imState, action.target, 'style', action.style);
    }

    if (action.type === types.ELEMENT_ACTION_CHANGE) {
        return doChangeElementValue(imState, action.id, 'action', action.action);
    }

    if (action.type.toString().startsWith('Symbol(TEST')) {
        return testReducer(imState, action);
    }

    if (action.type === types.ELEMENT_MULTIPLE_SELECT) {
        const index = imState.get('selects').findIndex(select => select === action.id);
        if (index === -1) {
            return imState.update('selects', list => list.push(action.id)).toJS();
        }
        return imState.update('selects', list => list.filter(item => item !== action.id)).toJS();
    }

    if (action.type === types.ELEMENT_ALIGN) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const elements = currentPage.get('elements');
        const selects = imState.get('selects');
        const selectedElements = elements.filter(element => selects.includes(element.get('id')));
        let newElements;
        switch (action.direction) {
        case 'left': newElements = alignLeft(selectedElements); break;
        case 'right': newElements = alignRight(selectedElements); break;
        case 'center': newElements = alignCenter(selectedElements); break;
        case 'middle': newElements = alignMiddle(selectedElements); break;
        case 'top': newElements = alignTop(selectedElements); break;
        case 'bottom': newElements = alignBottom(selectedElements); break;
        case 'horizontal': newElements = alignHorizontal(selectedElements); break;
        case 'vertical': newElements = alignVertical(selectedElements); break;
        default: break;
        }
        const newPage = currentPage.update('elements', list => list.map(element => {
            const index = newElements.findIndex(item => item.get('id') === element.get('id'));
            if (index !== -1) {
                return newElements.get(index);
            }
            return element;
        }));
        const index = newElements.findIndex(item => item.get('id') === imState.get('focus').get('id'));
        if (index !== -1) {
            return imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: newElements.get(index) }).toJS();
        }
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }

    if (action.type === types.HIGHLIGHT_ADD) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const newPage = currentPage.update('elements', list => list.push(action.element));
        const newState = imState.set('pages', pages.set(imState.get('currentPage'), newPage));
        return newState.toJS();
    }

    if (action.type === types.HIGHLIGHT_CANCEL) {
        const pages = imState.get('pages');
        const currentPage = pages.get(imState.get('currentPage'));
        const newPage = currentPage.update('elements', list => list.filter(item => item.get('name') !== 'HighlightModal'));
        const newState = imState.set('pages', pages.set(imState.get('currentPage'), newPage));
        return newState.toJS();
    }

    return state;
}

function alignLeft(elements) {
    let minLeft = 375;
    elements.forEach(element => {
        const left = parseInt(element.get('style').get('left'));
        if (left < minLeft) {
            minLeft = left;
        }
    });
    if (elements.size === 1) {
        minLeft = 0;
    }
    return elements.map(element => element.set('style', element.get('style').set('left', minLeft)));
}

function alignRight(elements) {
    let maxLeft = 0;
    elements.forEach(element => {
        const left = parseInt(element.get('style').get('left'));
        const width = parseInt(element.get('style').get('width'));
        if ((left + width) > maxLeft) {
            maxLeft = left + width;
        }
    });
    if (elements.size === 1) {
        maxLeft = 375;
    }
    return elements.map(element => {
        const width = parseInt(element.get('style').get('width'));
        return element.set('style', element.get('style').set('left', maxLeft - width));
    });
}

function alignCenter(elements) {
    let maxLeft = 0;
    elements.forEach(element => {
        const left = parseInt(element.get('style').get('left'));
        const width = parseInt(element.get('style').get('width'));
        if ((left + width) > maxLeft) {
            maxLeft = left + width;
        }
    });
    if (elements.size === 1) {
        maxLeft = 375;
    }
    return elements.map(element => {
        const width = parseInt(element.get('style').get('width'));
        return element.set('style', element.get('style').set('left', (maxLeft - width) / 2));
    });
}

function alignTop(elements) {
    let minTop = 667;
    elements.forEach(element => {
        const top = parseInt(element.get('style').get('top'));
        if (top < minTop) {
            minTop = top;
        }
    });
    if (elements.size === 1) {
        minTop = 0;
    }
    return elements.map(element => element.set('style', element.get('style').set('top', minTop)));
}

function alignMiddle(elements) {
    let maxTop = 0;
    elements.forEach(element => {
        const top = parseInt(element.get('style').get('top'));
        const height = parseInt(element.get('style').get('height'));
        if ((top + height) > maxTop) {
            maxTop = top + height;
        }
    });
    if (elements.size === 1) {
        maxTop = 667;
    }
    return elements.map(element => {
        const height = parseInt(element.get('style').get('height'));
        return element.set('style', element.get('style').set('top', (maxTop - height) / 2));
    });
}

function alignBottom(elements) {
    let maxTop = 0;
    elements.forEach(element => {
        const top = parseInt(element.get('style').get('top'));
        const height = parseInt(element.get('style').get('height'));
        if ((top + height) > maxTop) {
            maxTop = top + height;
        }
    });
    if (elements.size === 1) {
        maxTop = 667;
    }
    return elements.map(element => {
        const height = parseInt(element.get('style').get('height'));
        return element.set('style', element.get('style').set('top', maxTop - height));
    });
}

function alignHorizontal(elements) {
    let totalWidth = 0;
    elements.forEach(element => {
        totalWidth += parseInt(element.get('style').get('width'));
    });
    const average = (375 - totalWidth) / (elements.size + 1);
    let previousWidth = 0;
    return elements.map((element, index) => {
        const newElement = element.set('style', element.get('style').set('left', ((index + 1) * average) + previousWidth));
        previousWidth += parseInt(element.get('style').get('width'));
        return newElement;
    });
}

function alignVertical(elements) {
    let totalHeight = 0;
    elements.forEach(element => {
        totalHeight += parseInt(element.get('style').get('height'));
    });
    const average = (667 - totalHeight) / (elements.size + 1);
    let previousHeight = 0;
    return elements.map((element, index) => {
        const newElement = element.set('style', element.get('style').set('top', ((index + 1) * average) + previousHeight));
        previousHeight += parseInt(element.get('style').get('height'));
        return newElement;
    });
}

function resetSort(imState) {
    const pages = imState.get('pages');
    const currentPage = pages.get(imState.get('currentPage'));

    const newPage = currentPage.update('elements', list => list.map(element => {
        if (element.get('name') === 'SortQuestionModal') {
            return element.set('answerShow', '');
        }
        return element;
    }));
    return imState.set('pages', pages.set(imState.get('currentPage'), newPage));
}
