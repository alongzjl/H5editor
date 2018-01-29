package com.xyznotes.h5.template.dao;

import com.xyznotes.h5.template.model.TemplateGroup;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
@Service
public interface TemplateGroupMapper {

    TemplateGroup findByGroupName(String groupName);

    TemplateGroup findByGroupNumber(Integer groupNumber);

    void save(TemplateGroup templateGroup);

    TemplateGroup findById(Integer id);

    void update(TemplateGroup toupdate);

    void delete(TemplateGroup templateGroup);

    /**
     * 根据父分类查找子分类
     * @param parentId 父分类id，如果为null，找出的就是顶级分类
     */
    List<TemplateGroup> findByParent(@Param("id") Integer parentId);

    /**
     * @param parentId 父分类id，可以为null
     */
    long count(@Param("id") Integer parentId);

    void updateUseCount(Integer id);
}
