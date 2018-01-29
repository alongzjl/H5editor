package com.xyznotes.h5.course.service;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.course.dao.CourseMapper;
import com.xyznotes.h5.course.dto.CourseDataDto;
import com.xyznotes.h5.course.model.Course;
import com.xyznotes.h5.user.model.User;
import com.xyznotes.h5.user.service.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class CourseService {
    private CourseMapper courseMapper;
    private IUserService userService;

    /**
     * 查询所有的课程
     * @param criteria 筛选的条件
     */
    public Page<Course> list(Criteria criteria) throws AppException {
        long totalCount = courseMapper.count(criteria);
        List<Course> courses = courseMapper.list(criteria);
//        for (Course course : courses){
//            User user = userService.find(course.getUserId());
//            course.setUsername(user.getUsername());
//        }
        return new PageImpl<>(courses, new PageRequest(criteria.page - 1, criteria.pageSize), totalCount);
    }

    /**
     * 获得课程数量
     * @param criteria
     * @return
     */
    public long count(Criteria criteria) {
        return courseMapper.count(criteria);
    }

    /**
     * 通过id查找课程
     *
     * @param id not null
     * @throws AppException
     */
    public Course find(Integer id) throws AppException {
        Course course = courseMapper.findById(id);
        if (course == null) {
            throw new AppException(MessageCode.COURSE_NOT_EXIST_ERROR, id);
        }
        return course;
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Integer id, Integer userId) throws AppException {
        Course course = find(id);
        if (userId != null){
            if (!Objects.equals(course.getUserId(), userId)) {
                throw new AppException(MessageCode.COURSE_INVALID_DELETE_ERROR);
            }
        }

        courseMapper.deleteById(course);
    }

    /**
     * 更新浏览数量 +1
     * @param courseId not null
     */
    @Transactional(rollbackFor = Exception.class)
    public Course updateScanCount(Integer courseId) throws AppException {
        Course course = find(courseId);
        courseMapper.updateScanCount(courseId);
        return course;
    }

    public List<Course> listAll(Criteria criteria) throws AppException {
        return courseMapper.list(criteria);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Course course) throws AppException {
        course.setState(false);
        course.setCreateDate(new Date());
        courseMapper.save(course);
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Course course) throws AppException {
        courseMapper.updateContent(course);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateState(Integer courseId) throws AppException {
        courseMapper.updateState(courseId);
    }

    public Integer countScanCount(Criteria criteria){
        Integer scanCount = courseMapper.countScanCount(criteria);
        if(scanCount == null) {
            scanCount = 0;
        }
        return scanCount;
    }

    public Integer allApplyCountByUserId(Criteria criteria){
        criteria.conditionMap.put("now", new Date());
        Integer applyCount = courseMapper.allApplyCountByUserId(criteria);
        if(applyCount == null){
            applyCount = 0;
        }
        return applyCount;
    }


    public List<CourseDataDto> getCourseData() {
        return courseMapper.getCourseData();
    }

    @Transactional(rollbackFor = Exception.class)
    public void copy(Integer courseId, Integer id) throws AppException {
        Course course = courseMapper.findById(courseId);
        if(course.getUserId().equals(id)){
            Course toUpdate = new Course();
            toUpdate.setName(course.getName());
            toUpdate.setSubtitle(course.getSubtitle());
            toUpdate.setCover(course.getCover());
            toUpdate.setUserId(course.getUserId());
            toUpdate.setState(false);
            toUpdate.setMusicPath(course.getMusicPath());
            toUpdate.setMusicName(course.getMusicName());
            toUpdate.setPages(course.getPages());
            save(toUpdate);
        }
    }

    @Resource
    public void setCourseMapper(CourseMapper courseMapper) {
        this.courseMapper = courseMapper;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }
}
