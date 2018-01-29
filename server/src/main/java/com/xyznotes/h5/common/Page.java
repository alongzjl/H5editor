package com.xyznotes.h5.common;

import java.util.List;

/**
 * Created by sunlong on 2017/4/24.
 */
public class Page<T> {
    private long total;
    private List<T> content;

    public Page(List<T> content, long totalCount) {
        this.total = totalCount;
        this.content = content;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }
}
