package com.xyznotes.h5.template.service;

import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.template.dao.TemplateGroupMapper;
import com.xyznotes.h5.template.model.TemplateGroup;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
@Transactional(readOnly = true)
@Service
public class TemplateGroupService {
    @Resource
    private TemplateGroupMapper templateGroupMapper;

    @Transactional(rollbackFor = Exception.class)
    public void create(TemplateGroup templateGroup) throws AppException {
        TemplateGroup templateGroupByName = templateGroupMapper.findByGroupName(templateGroup.getGroupName());
        if(templateGroupByName!=null){
            throw new AppException(MessageCode.TEMPLATEGROUP_NAME_EXIST_ERROR, templateGroupByName.getGroupName());
        }

        TemplateGroup templateGroupByNumber = templateGroupMapper.findByGroupNumber(templateGroup.getGroupNumber());
        if(templateGroupByNumber!=null){
            throw new AppException(MessageCode.TEMPLATEGROUP_NUMBER_EXIST_ERROR, templateGroupByNumber.getGroupNumber());
        }

        templateGroupMapper.save(templateGroup);
    }

    public TemplateGroup findById(Integer id) throws AppException {
        TemplateGroup templateGroup = templateGroupMapper.findById(id);
        if(templateGroup == null){
            throw new AppException(MessageCode.TEMPLATEGROUP_NOT_EXIST_ERROR, id);
        }
        return templateGroup;
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(TemplateGroup  templateGroup)throws AppException{

        TemplateGroup templateGroupByName = templateGroupMapper.findByGroupName(templateGroup.getGroupName());
        if(templateGroupByName!=null && !templateGroupByName.getId().equals(templateGroup.getId())){
            throw new AppException(MessageCode.TEMPLATEGROUP_NAME_EXIST_ERROR, templateGroupByName.getGroupName());
        }

        TemplateGroup templateGroupByNumber = templateGroupMapper.findByGroupNumber(templateGroup.getGroupNumber());
        if(templateGroupByNumber!=null && !templateGroupByNumber.getId().equals(templateGroup.getId())){
            throw new AppException(MessageCode.TEMPLATEGROUP_NUMBER_EXIST_ERROR, templateGroupByNumber.getGroupNumber());
        }

        templateGroupMapper.update(templateGroup);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) throws AppException {
        TemplateGroup templateGroup = findById(id);
        templateGroupMapper.delete(templateGroup);
    }

    public List<TemplateGroup> findByParent(Integer parentId) {
        return templateGroupMapper.findByParent(parentId);
    }

    public long count(Integer id) {
        return templateGroupMapper.count(id);
    }
}
