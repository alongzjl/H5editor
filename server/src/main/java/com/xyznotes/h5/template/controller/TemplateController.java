package com.xyznotes.h5.template.controller;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.SortBean;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.template.model.Template;
import com.xyznotes.h5.template.model.TemplateGroup;
import com.xyznotes.h5.template.service.TemplateGroupService;
import com.xyznotes.h5.template.service.TemplateService;
import com.xyznotes.h5.user.model.UserToken;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Controller
@RequestMapping("/api")
public class TemplateController {
    @Resource
    private TemplateService templateService;
    @Resource
    private TemplateGroupService templateGroupService;

    @RequestMapping("/templates")
    @ResponseBody
    @Auth
    public Result list(@RequestParam(defaultValue = "1") int page,
                       @RequestParam(defaultValue = "9") int pageSize,
                       boolean isPublic,
                       SortBean sortBean, @RequestAttribute("userid") UserToken userToken, String name) throws Exception {
        if (sortBean.getSortName() == null) {
            sortBean.setSortDir("DESC");
            sortBean.setSortName("created_date");
        }
        Criteria criteria = new Criteria(page, pageSize, sortBean.getSortName(), sortBean.getSortDir());
        if (isPublic) {
            criteria.conditionMap.put("is_public", true);
        } else {
            criteria.conditionMap.put("userId", userToken.getId());
        }
        if (StringUtils.isNotBlank(name)) {
            criteria.conditionMap.put("name", name);
            saveSearch(name);
        }

        Page<Template> templates = templateService.list(criteria);
        return new Result<>(true, templates);
    }

    private void saveSearch(String name) {
        templateService.saveSearch(name.trim());
    }

    @RequestMapping("/templates/listSearch")
    @ResponseBody
    public Result listSearch() throws Exception {
        return new Result<>(true, templateService.listSearch());
    }

    @RequestMapping(value = "/template/{templateId}")
    @ResponseBody
    public Result show(@PathVariable Integer templateId) throws AppException {
        Template template = templateService.findById(templateId);
        if (template.getTemplateGroupId() != null) {
            TemplateGroup templateGroup = templateGroupService.findById(template.getTemplateGroupId());
            template.setChildGroupName(templateGroup.getGroupName());
            if (templateGroup.getParentId() != null) {
                template.setTemplateParentGroupId(templateGroup.getParentId());
                TemplateGroup parentTemplateGroup = templateGroupService.findById(templateGroup.getParentId());
                template.setParentGroupName(parentTemplateGroup.getGroupName());
            }
        }
        return new Result<>(true, template);
    }

    /**
     * 保存修改模板
     *
     * @return
     * @throws AppException
     */
    @RequestMapping(value = "/template", method = RequestMethod.POST)
    @ResponseBody
    @Auth
    public Result create(@RequestBody Template template, @RequestAttribute("userid") UserToken userToken) throws AppException {
        if (template.getId() != null) {
            Template exist = templateService.findById(template.getId());
            if(!exist.getUserId().equals(userToken.getId())){
                return new Result<>(false, "您没有权限修改别人的模板");
            }
            templateService.update(template);
        } else {
            template.setUserId(userToken.getId());
            templateService.save(template);
        }
        return new Result<>(true, template.getId());
    }

    /**
     * 复制课程
     */
    @RequestMapping(value = "/copyTemplate", method = RequestMethod.POST)
    @ResponseBody
    @Auth
    public Result copy(Integer templateId) throws AppException {
        Template template = templateService.findById(templateId);
        Template toUpdate = new Template();
        toUpdate.setName(template.getName());
        toUpdate.setMusicName(template.getMusicName());
        toUpdate.setCover(template.getCover());
        toUpdate.setUserId(template.getUserId());
        toUpdate.setState(false);
        toUpdate.setMusicPath(template.getMusicPath());
        toUpdate.setTemplateGroupId(template.getTemplateGroupId());
        toUpdate.setPages(template.getPages());

        templateService.save(toUpdate);

        return new Result<>(true, toUpdate.getId());

    }


    @RequestMapping(value = "/updateUseCount")
    @ResponseBody
    public Result updateUseCount(Integer id) throws AppException {
        //使用次数+1
        Template template = templateService.updateUseCount(id);
        return new Result<>(true, template.getUseCount());
    }

    @DeleteMapping("/template/{id}")
    @ResponseBody
    @Auth
    public Result delete(@PathVariable Integer id) throws AppException {
        templateService.delete(id);
        return new Result();
    }

    @RequestMapping(value = "/updateState")
    @ResponseBody
    @Auth
    public Result updateState(Integer templateId) throws AppException {
        templateService.updateState(templateId);
        return new Result();
    }
}
