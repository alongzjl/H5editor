package com.xyznotes.h5.course.service;

import com.xyznotes.h5.common.Page;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.course.model.Course;

/**
 * Created by sunlong on 15/9/6.
 */
public interface ICourseService {
    void delete(Integer id) throws AppException;

    void save(Course Course) throws AppException;

    void update(Course Course) throws AppException;

    Page<Course> list(int page, int pageSize);

    Page<Course> list(int page, int pageSize, Integer userId);

    Course show(Integer id);
}
