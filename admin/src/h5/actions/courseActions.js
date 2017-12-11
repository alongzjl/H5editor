import * as types from './actionTypes';

export function changeCourses(courses, total) {
    return {
        type: types.COURSE_LIST_SUCCESS,
        courses,
        total,
    };
}

export function changeCourse(course) {
    return {
        type: types.COURSE_CHANGE,
        course,
    };
}
