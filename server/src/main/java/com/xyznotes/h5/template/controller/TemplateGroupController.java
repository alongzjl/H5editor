package com.xyznotes.h5.template.controller;

import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.template.model.TemplateGroup;
import com.xyznotes.h5.template.service.TemplateGroupService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * 模板分类
 * Created by sunlong on 15/3/2.
 */
@RequestMapping("/templateGroup")
@Controller
public class TemplateGroupController {
    @Resource
    private TemplateGroupService templateGroupService;

    /**
     * 获取所有分类以及子分类
     */
    @RequestMapping("/listCategories")
    @ResponseBody
    public Result listCategories(@RequestParam(required = false) Integer parentCategoryId) throws AppException {
        List<TemplateGroup> categories = templateGroupService.findByParent(parentCategoryId);
        for(TemplateGroup category: categories){
            List<TemplateGroup> templateGroupList = templateGroupService.findByParent(category.getId());
            category.setChildren(templateGroupList);
        }
        return new Result<>(true , categories);
    }


    @RequestMapping("/getChildGroup")
    @ResponseBody
    public Result getParentGroup(Integer parentId) throws AppException {
        return new Result<>(true,templateGroupService.findByParent(parentId));
    }
}
