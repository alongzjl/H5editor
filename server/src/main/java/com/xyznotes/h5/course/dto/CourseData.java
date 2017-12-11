package com.xyznotes.h5.course.dto;

/**
 * Created by sunlong on 16/12/7.
 */
public class CourseData {
    private long allCount;
    private long allScanCount;
    private long yesterdayScanCount;

    public long getAllCount() {
        return allCount;
    }

    public void setAllCount(long allCount) {
        this.allCount = allCount;
    }

    public long getAllScanCount() {
        return allScanCount;
    }

    public void setAllScanCount(long allScanCount) {
        this.allScanCount = allScanCount;
    }

    public long getYesterdayScanCount() {
        return yesterdayScanCount;
    }

    public void setYesterdayScanCount(long yesterdayScanCount) {
        this.yesterdayScanCount = yesterdayScanCount;
    }
}
