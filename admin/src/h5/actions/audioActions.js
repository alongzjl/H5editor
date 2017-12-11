import * as types from './actionTypes';

export function changeAudios(audios, total) {
    return {
        type: types.AUDIO_LIST_SUCCESS,
        audios,
        total,
    };
}

export function changeAudio(audio) {
    return {
        type: types.AUDIO_CHANGE,
        audio,
    };
}
