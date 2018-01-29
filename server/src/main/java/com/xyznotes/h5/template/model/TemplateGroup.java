package com.xyznotes.h5.template.model;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * Created by sunlong on 2014/9/22.
 */
public class TemplateGroup implements Serializable {
    private int id;

    @NotBlank
    @Length(max = 50)
    private String groupName;

    @NotNull
    private int groupNumber;

    private int useCount;//使用所含模板使用次数

    private Integer parentId;

    private List<TemplateGroup> children;

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUseCount() {
        return useCount;
    }

    public void setUseCount(Integer useCount) {
        this.useCount = useCount;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setUseCount(int useCount) {
        this.useCount = useCount;
    }

    public List<TemplateGroup> getChildren() {
        return children;
    }

    public void setChildren(List<TemplateGroup> children) {
        this.children = children;
    }

    public int getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(int groupNumber) {
        this.groupNumber = groupNumber;
    }
}
