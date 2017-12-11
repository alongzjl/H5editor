package com.xyznotes.h5.template.service;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.template.dao.TemplateGroupMapper;
import com.xyznotes.h5.template.dao.TemplateMapper;
import com.xyznotes.h5.template.dao.TemplateSearchMapper;
import com.xyznotes.h5.template.model.Template;
import com.xyznotes.h5.template.model.TemplateGroup;
import com.xyznotes.h5.template.model.TemplateSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
@Transactional(readOnly = true)
@Service
public class TemplateService {
    @Resource
    private TemplateMapper templateMapper;
    @Resource
    private TemplateGroupMapper templateGroupMapper;
    @Resource
    private TemplateSearchMapper templateSearchMapper;

    public Page<Template> list(Criteria criteria) {
        long totalCount = templateMapper.count(criteria);
        List<Template> templates = templateMapper.list(criteria);
        for(Template template : templates){
            if(template.getTemplateGroupId() != null){
                TemplateGroup templateGroup = templateGroupMapper.findById(template.getTemplateGroupId());
                template.setChildGroupName(templateGroup.getGroupName());
                if (templateGroup.getParentId() != null){
                    template.setTemplateParentGroupId(templateGroup.getParentId());
                    TemplateGroup parentTemplateGroup = templateGroupMapper.findById(templateGroup.getParentId());
                    template.setParentGroupName(parentTemplateGroup.getGroupName());
                }
            }
        }
        return new PageImpl<>(templates, new PageRequest(criteria.page - 1, criteria.pageSize), totalCount);
    }

    public long count(Criteria criteria) {
        return templateMapper.count(criteria);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Template template) throws AppException {
        template.setCreatedDate(new Date());
        templateMapper.save(template);
    }

    public Template findById(Integer id) throws AppException {
        Template template = templateMapper.findById(id);
        if (template == null) {
            throw new AppException(MessageCode.TEMPLATE_NOT_EXIST_ERROR, id);
        }

        return template;
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Template template) throws AppException {
        templateMapper.update(template);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) throws AppException {
        Template template = findById(id);
        templateMapper.delete(template);
    }


    /**
     * 更新使用数量 +1
     * @param id not null
     */
    @Transactional(rollbackFor = Exception.class)
    public Template updateUseCount(Integer id) throws AppException {
        Template template = templateMapper.findById(id);
        templateMapper.updateUseCount(id);
        return template;
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateState(Integer templateId) throws AppException {
        templateMapper.updateState(templateId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveSearch(String name) {
        synchronized (this){
            TemplateSearch search = templateSearchMapper.findSearch(name);
            if(search == null){
                templateSearchMapper.saveSearch(name);
            }else{
                search.setCount(search.getCount()+1);
                templateSearchMapper.updateSearch(search);
            }
        }
    }

    public List<TemplateSearch> listSearch() {
        return templateSearchMapper.findTopSearches();
    }
}
