import * as types from './actionTypes';

export function listTemplates(templates, total) {
    return {
        type: types.TEMPLATE_LIST_SUCCESS,
        templates,
        total,
    };
}

export function changeTemplate(template) {
    return {
        type: types.TEMPLATE_CHANGE,
        template,
    };
}
