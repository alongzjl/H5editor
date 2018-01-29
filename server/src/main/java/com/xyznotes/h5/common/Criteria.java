package com.xyznotes.h5.common;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * User: sunlong
 * Date: 13-5-14
 * Time: 上午11:30
 */
public class Criteria implements Serializable{
    public Integer page;
    public Integer pageSize;
    public String orderName;
    public String orderDir;

    public class Order{
        public static final String ASC = "ASC";
        public static final String DESC = "DESC";
    }

    public final Map<String, Object> conditionMap;

    public Criteria(){
        conditionMap = new HashMap<>(0);
    }

    public Criteria(int pageSize, String orderName, String orderDir, Map<String, Object> conditionMap) {
        this.page = 1;
        this.pageSize = pageSize;
        this.orderName = orderName;
        this.orderDir = orderDir;
        this.conditionMap = conditionMap;
    }

    public Criteria(int page, int pageSize, String orderName, String orderDir) {
        this.page = page;
        this.pageSize = pageSize;
        this.orderName = orderName;
        this.orderDir = orderDir;
        this.conditionMap = new HashMap<>(0);
    }

    public int getStart(){
        return (page-1)*pageSize;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public String getOrderName() {
        return orderName;
    }

    public String getOrderDir() {
        return orderDir;
    }
}