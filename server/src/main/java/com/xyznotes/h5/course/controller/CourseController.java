package com.xyznotes.h5.course.controller;

import com.xyznotes.h5.common.Config;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.SortBean;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.course.dto.CourseData;
import com.xyznotes.h5.course.dto.CourseDataDto;
import com.xyznotes.h5.course.model.Course;
import com.xyznotes.h5.course.service.CourseService;
import com.xyznotes.h5.user.model.UserToken;
import org.apache.commons.io.FileUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.zeroturnaround.zip.ZipUtil;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


@Controller
@RequestMapping("/api")
@Auth
public class CourseController {
    @Resource
    private CourseService courseService;
    @Resource
    private Config config;
    private final RestTemplate template = new RestTemplate();

    /**
     * 查看课程列表
     */
    @GetMapping(value = "/courses")
    @ResponseBody
    @Auth
    public Result index(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            SortBean sortBean,
            String name,
            @RequestAttribute("userid") UserToken userToken) throws AppException {
        if (sortBean.getSortName() == null) {
            sortBean.setSortDir("DESC");
            sortBean.setSortName("create_date");
        }
        Criteria criteria = new Criteria(page, pageSize, sortBean.getSortName(), sortBean.getSortDir());
        criteria.conditionMap.put("user_id", userToken.getId());
        criteria.conditionMap.put("name", name);

        Page<Course> activities = courseService.list(criteria);

        return new Result<>(true, activities);
    }

    /**
     * 查询单个课程
     */

    @RequestMapping(value = "/course/{id}")
    @ResponseBody
    @Auth("anon")
    public Result findById(@PathVariable Integer id) throws AppException {
        Course course = courseService.updateScanCount(id);
        return new Result<>(true, course);
    }

    /**
     * 导出单个课程
     */
    @GetMapping(value = "/course/export/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Auth("anon")
    @ResponseBody
    public FileSystemResource export(@PathVariable Integer id) throws AppException {
        Course course = courseService.find(id);
        try {
            //复制文件
            String dist = config.getHtmlFolder() + course.getId();
            String zip = dist + ".zip";
            FileUtils.copyDirectory(new File(config.getHtmlFolder()), new File(dist), file -> {
                return !file.getPath().equals(dist) && !file.getPath().equals(zip);
            });

            //插入课程数据
            Document doc = Jsoup.parse(new File(config.getHtmlFolder() + "viewer.html"), "UTF-8", "http://editor.gopopon.com/");
            doc.head().append("<script>window.pages = " + course.getPages() + "</script>");
            FileUtils.writeStringToFile(new File(config.getHtmlFolder() + course.getId() + "/viewer.html"), doc.outerHtml(), "UTF-8");

            //压缩
            File zipFile = new File(zip);
            if (zipFile.exists()) {
                zipFile.delete();
            }
            ZipUtil.pack(new File(dist), zipFile);
            return new FileSystemResource(zipFile);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 保存创建
     */
    @RequestMapping(value = "/course", method = RequestMethod.POST)
    @ResponseBody
    @Auth("anon")
    public Result create(@RequestBody Course course) throws Exception {
        course.setUserId(1);
        if (course.getId() != null) {
            courseService.update(course);
            String url = config.getDomain() + "/viewer.html#/" + course.getId() + "/b";
            template.getForObject(config.getRemoteApiDomain() + "wordoor_content_api/v1/material/callback?course_id=" + course.getId() + "&url=" + url,null);
        } else {
            courseService.save(course);
        }

        return new Result<>(true, course.getId());
    }


    /**
     * 复制课程
     */
    @RequestMapping(value = "/course/copy", method = RequestMethod.POST)
    @ResponseBody
    @Auth
    public Result copy(Integer courseId, @RequestAttribute("userid") UserToken userToken) throws AppException {
        courseService.copy(courseId, userToken.getId());
        return new Result<>(true, courseId);

    }

    /**
     * 删除课程
     */
    @DeleteMapping(value = "/course/{courseId}")
    @ResponseBody
    @Auth
    public Result delete(@PathVariable Integer courseId, @RequestAttribute("userid") UserToken userToken) throws AppException {
        courseService.deleteById(courseId, userToken.getId());
        return new Result();
    }

    @RequestMapping(value = "/course/updateScanCount")
    @ResponseBody
    public Result updateScanCount(Integer courseId) throws AppException {
        //浏览人数+1
        Course course = courseService.updateScanCount(courseId);
        return new Result<>(true, course.getScanCount());
    }

    @RequestMapping(value = "/course/updateState")
    @ResponseBody
    @Auth
    public Result updateState(Integer courseId, @RequestAttribute("userid") UserToken userToken) throws AppException {
        courseService.updateState(courseId);
        return new Result();
    }

    /**
     * 单个用户所有的课程量浏览量报名量
     */
    @RequestMapping(value = "/course/getAllCount")
    @ResponseBody
    @Auth
    public Result getAllCount(@RequestAttribute("userid") UserToken userToken) throws AppException {
        CourseData courseData = new CourseData();

        Criteria criteria = new Criteria();
        criteria.conditionMap.put("user_id", userToken.getId());
        courseData.setAllCount(courseService.count(criteria));

        courseData.setAllScanCount(getScanCount(userToken.getId(), null));
        courseData.setYesterdayScanCount(getScanCount(userToken.getId(), true));

        return new Result<>(true, courseData);
    }

    private int getScanCount(Integer userId, Boolean beforeToday) throws AppException {
        Criteria criteria = new Criteria();
        criteria.conditionMap.put("user_id", userId);
        if (beforeToday != null && beforeToday) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, -1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
            String yesterday = sdf.format(cal.getTime());
            criteria.conditionMap.put("end_date", sdf.format(new Date()));
            criteria.conditionMap.put("start_date", yesterday);
        }
        return courseService.countScanCount(criteria);
    }

    /***
     * 查看课程报名数量
     */
    @RequestMapping(value = "/course/allCountByUserId")
    @ResponseBody
    public Result countByUserId(Integer userId, String time) {
        Criteria criteria = new Criteria();
        criteria.conditionMap.put("user_id", userId);
        criteria.conditionMap.put(time, true);
        return new Result<>(true, courseService.allApplyCountByUserId(criteria));
    }

    /**
     * 统计所有课程总浏览量
     *
     * @param userId      用户id
     * @param beforeToday 截止时间
     * @return
     */
    @RequestMapping(value = "/course/getAllScanCount")
    @ResponseBody
    public Result getAllScanCount(Integer userId, Boolean beforeToday) throws AppException {
        Criteria criteria = new Criteria();
        criteria.conditionMap.put("user_id", userId);

        if (beforeToday != null && beforeToday) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            criteria.conditionMap.put("end_date", sdf.format(new Date()));
        }
        List<Course> activities = courseService.listAll(criteria);
        long scanCount = 0;
        for (Course course : activities) {
            scanCount += course.getScanCount();
        }
        return new Result<>(true, scanCount);
    }

    /***
     * 同步课程数据
     */
    @RequestMapping(value = "/course/getCourseData")
    @ResponseBody
    @Auth("anon")
    public Result getCourseData() throws AppException {
        List<CourseDataDto> courseDataDtoList = courseService.getCourseData();
        return new Result<>(true, courseDataDtoList);
    }
}