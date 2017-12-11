package com.xyznotes.h5.course.controller;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.SortBean;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.course.service.CourseService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
@RequestMapping("/admin/course")
@Auth
public class CourseAdminController {
    @Resource
    private CourseService courseService;

    /**
     * 查看课程列表
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Result list(@RequestParam(defaultValue = "1") int page,
                       @RequestParam(defaultValue = "10") int pageSize,
                       SortBean sortBean,
                       Integer id,
                       String name) throws AppException {
        if (sortBean.getSortName() == null) {
            sortBean.setSortDir("DESC");
            sortBean.setSortName("create_date");
        }
        Criteria criteria = new Criteria(page, pageSize, sortBean.getSortName(), sortBean.getSortDir());
        criteria.conditionMap.put("id", id);
        criteria.conditionMap.put("name", name);

        return new Result<>(true, courseService.list(criteria));
    }

    /**
     * 删除课程
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public Result delete(Integer courseId) throws AppException {
        courseService.deleteById(courseId,null);
        return new Result();
    }
}