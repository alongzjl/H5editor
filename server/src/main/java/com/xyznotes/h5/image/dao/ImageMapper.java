package com.xyznotes.h5.image.dao;


import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.image.model.Image;

import java.util.List;

/**
 * User: sunlong
 * Date: 13-12-3
 * Time: 上午9:14
 */
public interface ImageMapper {

    Image findById(int id);

    //新建图片
    void save(Image image);

    void update(Image image);

    //通过id删除图片
    void deleteById(Integer id);

    List<Image> list(Criteria criteria);

    long count(Criteria criteria);
}
