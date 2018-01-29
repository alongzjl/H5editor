package com.xyznotes.h5.image.model;

import java.io.Serializable;

/**
 * Created by sunlong on 2015/11/27.
 */
public class Crop implements Serializable {
    private float x;
    private float y;
    private float width;
    private float height;

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public String getCrop() {
        return (int)x+","+(int)y+","+(int)width+","+(int)height;
    }
}
