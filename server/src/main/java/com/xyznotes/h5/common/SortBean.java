package com.xyznotes.h5.common;

/**
 * User: sunlong
 * Date: 13-4-12
 * Time: 下午2:16
 */
public class SortBean {
    private String sortName;
    private String sortDir;

    public SortBean(String sortName, String sortDir) {
        this.sortName = sortName;
        this.sortDir = sortDir;
    }

    public SortBean(){}

    public String getSortName() {
        return sortName;
    }

    public void setSortName(String sortName) {
        this.sortName = sortName;
    }

    public String getSortDir() {
        return sortDir;
    }

    public void setSortDir(String sortDir) {
        this.sortDir = sortDir;
    }

    public String getSort(){
        return sortName + " " + sortDir;
    }
}
