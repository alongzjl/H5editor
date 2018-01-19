import * as types from './actionTypes';

export function addPage(page, notRedoable = false) {
    return {
        type: types.PAGE_ADD,
        page,
        notRedoable,
    };
}

export function initPage(page, notRedoable = false) {
    return {
        type: types.PAGE_INIT,
        page,
        notRedoable,
    };
}

export function delPage(id) {
    return {
        type: types.PAGE_DELETE,
        id,
    };
}
export function copyPage(id) {
    return {
        type: types.PAGE_COPY,
        id,
    };
}
export function sortPage(oldIndex, newIndex) {
    return {
        type: types.PAGE_SORT,
        oldIndex,
        newIndex,
    };
}
export function renamePage(id, title) {
    return {
        type: types.PAGE_RENAME,
        id,
        title,
    };
}

export function replacePage(page) {
    return {
        type: types.PAGE_REPLACE,
        page,
    };
}

export function changePageEditable(id) {
    return {
        type: types.PAGE_EDITABLE_CHANGE,
        id,
    };
}
export function changePageStyle(style) {
    return {
        type: types.PAGE_STYLE_CHANGE,
        style,
    };
}

export function addElements(...elements) {
    return {
        type: types.ELEMENT_ADD,
        elements,
    };
}

export function delElement(id = '') {
    return {
        type: types.ELEMENT_DELETE,
        id,
    };
}
export function delElementId(id) {
    return {
        type: types.ELEMENT_DELETE_ID,
        id,
    };
}

export function copyElement() {
    return {
        type: types.ELEMENT_COPY,
    };
}

export function changeElementVisibility(target, style) {
    return {
        type: types.ELEMENT_VISIBILITY_CHANGE,
        target,
        style,
    };
}

export function changeFocus(focus) {
    return {
        type: types.FOCUS_CHANGED,
        focus,
    };
}

export function changeCurrentPage(index) {
    return {
        type: types.CURRENTPAGE_CHANGE,
        index,
    };
}

export function changeStyle(style) {
    return {
        type: types.STYLE_CHANGE,
        style,
    };
}

export function changeAnimation(index, animation) {
    return {
        type: types.ANIMATION_CHANGE,
        index,
        animation,
    };
}

export function addAnimation(animation) {
    return {
        type: types.ANIMATION_ADD,
        animation,
    };
}

export function delAnimation(index) {
    return {
        type: types.ANIMATION_DELETE,
        index,
    };
}

export function changeWordEditable(id, editable) {
    return {
        type: types.WORD_EDITABLE_CHANGE,
        id,
        editable,
    };
}
export function changeWordText(id, text) {
    return {
        type: types.WORD_TEXT_CHANGE,
        id,
        text, 
    };
}
export function changeWordPinyin(pinyin) {
    return {
        type: types.WORD_PINYIN_CHANGE,
        pinyin,
    };
}
export function changeWordFace(fontFace) {
    return {
        type: types.WORD_FONT_FACE_CHANGE,
        fontFace,
    };
}
export function changeWordAnswerChoose(id,chooseAnswer) {
    return {
        type: types.WORD_ANSWER_CHOOSE_CHANGE,
        id,
        chooseAnswer,
    };
}
export function changeWordAccessKey(accessKey) {
    return {
        type: types.WORD_ACCESS_KEY_CHANGE,
        accessKey,
    };
}
export function changeWordSymbol(symbol, index) {
    return {
        type: types.WORD_SYMBOL_CHANGE,
        symbol,
        index,
    };
}
export function toggleWordSymbol(symbol) {
    return {
        type: types.WORD_SYMBOL_TOGGLE,
        symbol,
    };
}
export function changeImage(src) {
    return {
        type: types.IMAGE_CHANGE,
        src,
    };
}

export function changeAudio(src) {
    return {
        type: types.AUDIO_CHANGE,
        src,
    };
}
export function changeVideo(code) {
    return {
        type: types.VIDEO_CHANGE,
        code,
    };
}

export function changeShape(shapeName) {
    return {
        type: types.SHAPE_CHANGE,
        shapeName,
    };
}

export function changeNote(note) {
    return {
        type: types.NOTE_CHANGE,
        note,
    };
}

export function changeTemplate(templateId, name, pages) {
    return {
        type: types.TEMPLATE_CHANGE,
        templateId,
        name,
        pages,
        notRedoable: true,
    };
}

export function changeCourse(courseId, pages, templateId) {
    return {
        type: types.COURSE_CHANGE,
        courseId,
        templateId,
        pages,
        notRedoable: true,
    };
}

export function changeAction(id, action) {
    return {
        type: types.ELEMENT_ACTION_CHANGE,
        id,
        action,
        notRedoable: true,
    };
}

export function moveUpElement() {
    return {
        type: types.ELEMENT_MOVE_UP,
    };
}

export function moveUpMostElement() {
    return {
        type: types.ELEMENT_MOVE_UP_MOST,
    };
}

export function moveDownElement() {
    return {
        type: types.ELEMENT_MOVE_DOWN,
    };
}

export function moveDownMostElement() {
    return {
        type: types.ELEMENT_MOVE_DOWN_MOST,
    };
}

export function selectMultiple(id) {
    return {
        type: types.ELEMENT_MULTIPLE_SELECT,
        id,
    };
}

export function alignElements(direction) {
    return {
        type: types.ELEMENT_ALIGN,
        direction,
    };
}

export function addHighlight(element) {
    return {
        type: types.HIGHLIGHT_ADD,
        element,
        notRedoable: true,
    };
}

export function cancelHighlight() {
    return {
        type: types.HIGHLIGHT_CANCEL,
        notRedoable: true,
    };
}

export function refreshAnimation() {
    return {
        type: types.ANIMATION_REFRESH,
        notRedoable: true,
    };
}
