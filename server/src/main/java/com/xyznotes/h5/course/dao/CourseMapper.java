package com.xyznotes.h5.course.dao;


import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.course.dto.CourseDataDto;
import com.xyznotes.h5.course.model.Course;

import java.util.List;

/**
 * User: sunlong
 * Date: 13-12-3
 * Time: 上午9:14
 */
public interface CourseMapper {
    //统计创建的邀请函个数
    long count(Criteria criteria);

    //列出邀请函
    List<Course> list(Criteria criteria);

    //根据邀请函番号查到对应的邀请函
    Course findById(Integer id);

    //根据邀请函番号删除对应的邀请函
    void deleteById(Course course);

    //创建邀请函
    void save(Course course);

    //修改内容
    void updateContent(Course course);

    void updateScanCount(Integer courseId);

    void updateState(Integer courseId);

    Integer countScanCount(Criteria criteria);

    Integer countApplyCount(Criteria criteria);

    //单个用户所有课程的报名数
    Integer allApplyCountByUserId(Criteria criteria);

    List<CourseDataDto> getCourseData();
}
