package com.xyznotes.h5.template.dao;


import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.template.model.Template;

import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
public interface TemplateMapper {
    long count(Criteria criteria);

    List<Template> list(Criteria criteria);

    void save(Template template);

    Template findById(Integer id);

    void update(Template toSave);

    void delete(Template template);

    void updateUseCount(Integer id);

    void updateState(Integer activityId);
}
