package com.xyznotes.h5.template.dao;


import com.xyznotes.h5.template.model.TemplateSearch;

import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
public interface TemplateSearchMapper {
    TemplateSearch findSearch(String name);

    void saveSearch(String name);

    void updateSearch(TemplateSearch search);

    List<TemplateSearch> findTopSearches();
}
