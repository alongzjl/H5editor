import * as types from './actionTypes';

export function changeCategories(categories, total) {
    return {
        type: types.CATEGORY_LIST_SUCCESS,
        categories,
        total,
    };
}

export function changeCategory(category) {
    return {
        type: types.CATEGORY_CHANGE,
        category,
    };
}
