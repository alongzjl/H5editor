import Immutable from 'immutable';
import BaseModal from '../components/h5/modal/BaseModal';
import regeneratorRuntime from 'regenerator-runtime';

/**
 * 修改当前页面中某个元素的值
 * 此元素可能是对象，数组中的某个元素，或是单纯的一个值
 * @param imState 不可修改的state
 * @param elementId 对应元素的id
 * @param key 要修改的属性
 * @param value 对应的值
 * @param valueIndex 如果是数据，传递这个值所在数组的索引
 * @returns {*}
 */
function getNewElementAndNewPage(imState, elementId, key, value, valueIndex) {
    const pages = imState.get('pages');
    const currentPage = pages.get(imState.get('currentPage'));
    const elements = currentPage.get('elements');
    const index = elements.findIndex(element => element.get('id') === elementId);
    if (index === -1) {
        return imState.toJS();
    }
    let newElement = null;
    if (typeof value === 'object' && key === 'style') {
        newElement = elements.get(index).set(key, elements.get(index).get(key).merge(Immutable.fromJS(value)));
    } else if (valueIndex !== undefined) { // 修改数组中的值
        if (value) {
            newElement = elements.get(index).set(key, elements.get(index).get(key).set(valueIndex, value));
        } else {
            newElement = elements.get(index).set(key, elements.get(index).get(key).delete(valueIndex));
        }
    } else if (value instanceof Array) { // 如果是数组
        newElement = elements.get(index).set(key, elements.get(index).get(key).concat(value));
    } else {
        newElement = elements.get(index).set(key, value);
    }
    const newPage = currentPage.set('elements', elements.set(index, newElement));
    return [newElement, newPage];
}

export function doChangeElementValue(imState, elementId, key, value, valueIndex) {
    const pages = imState.get('pages');
    const [newElement, newPage] = getNewElementAndNewPage(imState, elementId, key, value, valueIndex);
    const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: newElement });
    return newState.toJS();
}

export function doChangeElementValueWithoutChangeFocus(imState, elementId, key, value, valueIndex) {
    const pages = imState.get('pages');
    const [newElement, newPage] = getNewElementAndNewPage(imState, elementId, key, value, valueIndex);
    const newState = imState.set('pages', pages.set(imState.get('currentPage'), newPage));
    return newState.toJS();
}

export function changeElementValue(imState, key, value, valueIndex) {
    const elementId = imState.get('focus').get('id');
    return doChangeElementValue(imState, elementId, key, value, valueIndex);
}

export function changeMultiElementValue(imState, key, value) {
    const pages = imState.get('pages');
    const currentPage = pages.get(imState.get('currentPage'));
    const elementId = imState.get('focus').get('id');
    let newElement = null;
    const newPage = currentPage.update('elements', elements => elements.map(element => {
        if (element.get('id') === elementId) {
            newElement = element.set(key, element.get(key).merge(value));
            return newElement;
        } else if (imState.get('selects').includes(element.get('id'))) {
            return element.set(key, element.get(key).merge(value));
        }
        return element;
    }));
    const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus: newElement });
    return newState.toJS();
}

// 修改当前页面的值
export const changePageValue = (imState, key, value) => {
    const pages = imState.get('pages');
    const currentPage = pages.get(imState.get('currentPage'));
    let newPage = null;
    let focus = null;
    if (key === 'style') {
        newPage = currentPage.set(key, currentPage.get(key).merge(value));
        focus = newPage;
    } else if (key === 'elements') {
        if (value.name === 'TestConfirmModal') {
            newPage = currentPage.update('elements', list => list.push(value));
            const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage) });
            return newState.toJS();
        }
        if (value instanceof Array) {
            newPage = currentPage.update('elements', list => list.concat(value));
            focus = value[0];
        } else {
            newPage = currentPage.update('elements', list => list.push(value));
            focus = value;
        }
    }
    const newState = imState.merge({ pages: pages.set(imState.get('currentPage'), newPage), focus });
    return newState.toJS();
};

export function newIds(imPage) {
    const modal = new BaseModal();
    const elements = imPage.get('elements').map(element => element.set('id', modal.generateId()));
    return imPage.merge({
        id: modal.generateId(),
        elements,
    });
}

export function* sortElements(imState) {
    const pages = imState.get('pages');
    const currentPage = pages.get(imState.get('currentPage'));
    const elements = currentPage.get('elements');
    const index = elements.findIndex(element => element.get('id') === imState.get('focus').get('id'));
    // 返回 index 和 elements.length ，并接收新的index和判断
    const [newIndex, length] = yield [index, elements.size];
    if (index !== length) {
        const newElements = elements.delete(index).insert(newIndex, elements.get(index));
        const newPage = currentPage.set('elements', newElements);
        return imState.set('pages', pages.set(imState.get('currentPage'), newPage)).toJS();
    }
    return undefined;
}
