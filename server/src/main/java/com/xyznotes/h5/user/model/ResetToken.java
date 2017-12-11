package com.xyznotes.h5.user.model;

import java.io.Serializable;
import java.util.Date;

/**
 * User: sunlong
 * Date: 14-2-18
 * Time: 上午9:22
 */
public class ResetToken implements Serializable {
    private Integer id;
    private String code;
    private String email;
    private Date createdDate;
    private String salt;
    private Boolean valid;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }
}
