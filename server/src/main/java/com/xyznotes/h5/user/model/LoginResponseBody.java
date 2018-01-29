package com.xyznotes.h5.user.model;

import java.io.Serializable;

/**
 * 用户身份信息等等
 */
public class LoginResponseBody implements Serializable {
    private Boolean success;
    private Integer code;
    private LoginResult result;

    public LoginResponseBody(){ }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public LoginResult getResult() {
        return result;
    }

    public void setResult(LoginResult result) {
        this.result = result;
    }
}
