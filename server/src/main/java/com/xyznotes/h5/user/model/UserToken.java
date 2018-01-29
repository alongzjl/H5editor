package com.xyznotes.h5.user.model;

import java.io.Serializable;
import java.util.List;

/**
 * Created by sunlong on 15/11/30.
 */
public class UserToken implements Serializable{
    private Integer id;
    private Integer role;
    private Long datetime;
    private String avatar;
    private String name;
    List<String> permissions;

    private UserToken(){}

    public UserToken(Integer id, Integer role, String avatar, String name, Long datetime){
        this.id = id;
        this.role = role;
        this.name = name;
        this.avatar = avatar;
        this.datetime = datetime;
    }

    public Integer getId() {
        return id;
    }

    public long getDatetime() {
        return datetime;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getName() {
        return name;
    }

    public Integer getRole() {
        return role;
    }
}
