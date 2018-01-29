package com.xyznotes.h5.category.dao;

import com.xyznotes.h5.category.model.Category;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 分类
 * Created by sunlong on 15/2/11.
 */
public interface CategoryMapper {
    //新建
    void save(Category category);

    //通过id删除
    void deleteById(@Param("id") Integer id);

    List<Category> findAllCategory();

    List<Category> findByParent(@Param("id") Integer parentId);

    List<Category> findByParentAndType(@Param("id") Integer parentId, @Param("type") String type);

    long count(@Param("id") Integer id);

    Category findByName(String name);

    Category findByCategoryNoAndType(@Param("category_no") Integer categoryNo, @Param("type") String type);

    void update(Category category);

    Category findById(Integer id);
}
