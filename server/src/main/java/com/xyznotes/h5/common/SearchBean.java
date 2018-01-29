package com.xyznotes.h5.common;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * User: sunlong
 * Date: 13-4-1
 * Time: 上午10:06
 */
public class SearchBean {
    private Map<String, String> params;

    public Map<String, String> getParams() {
        if(params == null){
            params = new HashMap<>(0);
        }
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }

    public String genSearchParams() {
        StringBuilder queryStringBuilder = new StringBuilder("");
        if (params != null && params.size() > 0) {
            Iterator<Map.Entry<String, String>> it = params.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, String> entry = it.next();
                queryStringBuilder.append("params['").append(entry.getKey()).append("']").append('=').append(entry.getValue());
                if (it.hasNext()) {
                    queryStringBuilder.append('&');
                }
            }
        }
        return queryStringBuilder.toString();
    }

    public String genSearchParams2() {
        StringBuilder queryStringBuilder = new StringBuilder("");
        if (params != null && params.size() > 0) {
            Iterator<Map.Entry<String, String>> it = params.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, String> entry = it.next();
                queryStringBuilder.append(entry.getKey()).append('=').append(entry.getValue());
                if (it.hasNext()) {
                    queryStringBuilder.append('&');
                }
            }
        }
        return queryStringBuilder.toString();
    }
}