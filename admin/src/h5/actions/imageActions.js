import * as types from './actionTypes';

export function changeImages(images, total) {
    return {
        type: types.IMAGE_LIST_SUCCESS,
        images,
        total,
    };
}

export function changeImage(image) {
    return {
        type: types.IMAGE_CHANGE,
        image,
    };
}
