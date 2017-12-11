import * as types from './actionTypes';

export function hideNoteModal(hidden) {
    return {
        type: types.NOTE_MODAL,
        hidden,
    };
}
