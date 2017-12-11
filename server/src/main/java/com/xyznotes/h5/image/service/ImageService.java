package com.xyznotes.h5.image.service;

import com.xyznotes.h5.category.model.Category;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.image.dao.ImageMapper;
import com.xyznotes.h5.image.model.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * 图片库
 * Created by sunlong on 2014/9/22.
 */
@Service
@Transactional(readOnly = true)
public class ImageService {
    @Resource
    private ImageMapper imageMapper;

    public Image find(int id) throws AppException {
        return imageMapper.findById(id);
    }

    public Page<Image> list(Criteria criteria) throws AppException {
        long totalCount = imageMapper.count(criteria);
        List<Image> images = imageMapper.list(criteria);
        return new PageImpl<>(images, new PageRequest(criteria.page - 1, criteria.pageSize), totalCount);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Integer id) throws AppException {
        imageMapper.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Image image) {
        image.setCreatedDate(new Date());
        imageMapper.save(image);
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(int id, int categoryId) {
        Image image = imageMapper.findById(id);
        image.setPublic(true);
        image.setCategory(new Category(categoryId));
        imageMapper.update(image);
    }
}
