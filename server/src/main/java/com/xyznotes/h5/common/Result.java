package com.xyznotes.h5.common;

import java.io.Serializable;

/**
 * 如果success true，data返回的是实际的数据
 * 如果false，则data返回的是错误消息
 * User: sunlong
 * Date: 13-1-30
 * Time: 下午3:18
 */
public class Result<T> implements Serializable {

    private boolean success;
    private T data;
    private String msg;

    public Result(){
        this.success = true;
    }

    public Result(boolean success, T data){
        this.success = success;
        if(success){
            this.data = data;
        }else {
            this.msg = data.toString();
        }
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public String getMsg() {
        return msg;
    }
}
