package com.xyznotes.h5.common;

import java.util.ArrayList;
import java.util.List;

/**
 * User: sunlong
 * Date: 13-2-5
 * Time: 下午3:16
 */
public class TreeNode {
    private String name;
    private boolean isParent;//if it is leaf, isParent is true
    private String value;
    private boolean open;
    private List<TreeNode> children;

    public TreeNode(String name, boolean hasChildren, String value) {
        this.name = name;
        this.isParent = hasChildren;
        this.value = value;
        this.children = new ArrayList<>();
    }

    public TreeNode() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getIsParent() {
        return isParent;
    }

    public void setParent(boolean parent) {
        isParent = parent;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public List<TreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }
}
