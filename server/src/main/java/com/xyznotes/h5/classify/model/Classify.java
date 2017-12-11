package com.xyznotes.h5.classify.model;

import org.hibernate.validator.constraints.NotBlank;

import java.io.Serializable;

public class Classify implements Serializable {

    private Integer id;

    @NotBlank
    private String name;

    private String type;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
