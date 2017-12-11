package com.xyznotes.h5.statistics.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sunlong on 2014/9/24.
 */
public class Statistics implements Serializable {
    private List<String> categories = new ArrayList<String>();
    private String xtitle;
    private String subtitle;
    private String ytitle;
    private Map<String, Object> series = new HashMap<String, Object>();

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getXtitle() {
        return xtitle;
    }

    public void setXtitle(String xtitle) {
        this.xtitle = xtitle;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getYtitle() {
        return ytitle;
    }

    public void setYtitle(String ytitle) {
        this.ytitle = ytitle;
    }

    public Map<String, Object> getSeries() {
        return series;
    }

    public void setSeries(Map<String, Object> series) {
        this.series = series;
    }
}
