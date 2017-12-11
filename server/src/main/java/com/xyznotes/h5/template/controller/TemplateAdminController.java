package com.xyznotes.h5.template.controller;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.SortBean;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.template.service.TemplateService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
@RequestMapping("/admin/template")
@Auth
public class TemplateAdminController{
    @Resource
    private TemplateService templateService;

    /**
     * 查询模板列表
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Result index(@RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int pageSize,
                        SortBean sortBean,
                        String name) {
        if(sortBean.getSortName() == null){
            sortBean.setSortDir("DESC");
            sortBean.setSortName("created_date");
        }
        Criteria criteria = new Criteria(page, pageSize, sortBean.getSortName(), sortBean.getSortDir());
        criteria.conditionMap.put("name", name);

        return new Result<>(true, templateService.list(criteria));
    }

    @RequestMapping("/delete")
    @ResponseBody
    public Result delete(Integer id) throws AppException {
        templateService.delete(id);
        return new Result();
    }
}