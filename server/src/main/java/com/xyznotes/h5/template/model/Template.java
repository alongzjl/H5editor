package com.xyznotes.h5.template.model;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by sunlong on 2014/9/22.
 */
public class Template implements Serializable {
    private Integer id;

    @Length(max = 50)
    private String name;

    @Length(max = 128)
    private String cover;//缩略图

    @NotNull
    private Date createdDate;

    private Integer templateGroupId;

    private int useCount;//使用次数

    private String pages;

    private String musicPath; //音乐链接

    private String musicName; //音乐名称

    private Boolean state;

    private Boolean isDelete;

    private Integer templateParentGroupId;

    private String parentGroupName;

    private String childGroupName;

    private Integer userId;

    private boolean isPublic;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getParentGroupName() {
        return parentGroupName;
    }

    public void setParentGroupName(String parentGroupName) {
        this.parentGroupName = parentGroupName;
    }

    public String getChildGroupName() {
        return childGroupName;
    }

    public void setChildGroupName(String childGroupName) {
        this.childGroupName = childGroupName;
    }

    public Integer getTemplateParentGroupId() {
        return templateParentGroupId;
    }

    public void setTemplateParentGroupId(Integer templateParentGroupId) {
        this.templateParentGroupId = templateParentGroupId;
    }

    public int getUseCount() {
        return useCount;
    }

    public String getMusicName() {
        return musicName;
    }

    public void setMusicName(String musicName) {
        this.musicName = musicName;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

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


    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getMusicPath() {
        return musicPath;
    }

    public void setMusicPath(String musicPath) {
        this.musicPath = musicPath;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public Integer getTemplateGroupId() {
        return templateGroupId;
    }

    public void setTemplateGroupId(Integer templateGroupId) {
        this.templateGroupId = templateGroupId;
    }

    public void setUseCount(int useCount) {
        this.useCount = useCount;
    }

    public String getPages() {
        return pages;
    }

    public void setPages(String pages) {
        this.pages = pages;
    }

    public Boolean getDelete() {
        return isDelete;
    }

    public void setDelete(Boolean delete) {
        isDelete = delete;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }
}
