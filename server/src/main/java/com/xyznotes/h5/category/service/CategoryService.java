package com.xyznotes.h5.category.service;

import com.xyznotes.h5.category.dao.CategoryMapper;
import com.xyznotes.h5.category.model.Category;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by sunlong on 15/2/11.
 */
@Service
@Transactional(readOnly = true)
public class CategoryService {
    @Resource
    private CategoryMapper categoryMapper;

    public List<Category> findByParent(Integer parentId) throws AppException {
        return categoryMapper.findByParent(parentId);
    }

    public List<Category> findByParentAndType(Integer parentId, String type) throws AppException {
        return categoryMapper.findByParentAndType(parentId, type);
    }

    public List<Category> findAllCategory() throws AppException {
        return categoryMapper.findAllCategory();
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Integer id) throws AppException {
        categoryMapper.deleteById(id);
    }

    public long count(Integer id) {
        return categoryMapper.count(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Category category) throws AppException {
        Category category1 = categoryMapper.findByName(category.getName());
        if(category1 != null){
            throw new AppException(MessageCode.IMAGECATEGORY_EXIST_ERROR);
        }
        Category category2 = categoryMapper.findByCategoryNoAndType(category.getCategoryNo(), category.getType());
        if(category2 != null){
            throw new AppException(MessageCode.IMAGECATEGORY_CATEGORYNO_EXIST_ERROR);
        }
        categoryMapper.save(category);
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Category category) throws AppException {
        Category category1 = categoryMapper.findByName(category.getName());
        if(category1 != null && !category1.getId().equals(category.getId())){
            throw new AppException(MessageCode.IMAGECATEGORY_EXIST_ERROR);
        }
        Category category2 = categoryMapper.findByCategoryNoAndType(category.getCategoryNo(), category.getType());
        if(category2 != null && !category2.getId().equals(category.getId())){
            throw new AppException(MessageCode.IMAGECATEGORY_CATEGORYNO_EXIST_ERROR);
        }
        categoryMapper.update(category);
    }
}
