package com.xyznotes.h5.template.model;

import java.io.Serializable;

public class TemplateSearch implements Serializable{
    private Integer id;
    private String name;
    private int count = 1;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
