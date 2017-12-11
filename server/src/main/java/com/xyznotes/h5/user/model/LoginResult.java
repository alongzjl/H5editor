package com.xyznotes.h5.user.model;

import java.io.Serializable;

/**
 * 登陆结果
 *
 */
public class LoginResult implements Serializable {
    private Integer cm;
    private AccountInfo acct;

    public Integer getCm() {
        return cm;
    }

    public void setCm(Integer cm) {
        this.cm = cm;
    }

    public AccountInfo getAcct() {
        return acct;
    }

    public void setAcct(AccountInfo acct) {
        this.acct = acct;
    }
}
