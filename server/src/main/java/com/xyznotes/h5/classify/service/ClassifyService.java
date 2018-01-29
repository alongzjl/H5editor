package com.xyznotes.h5.classify.service;

import com.xyznotes.h5.classify.dao.ClassifyMapper;
import com.xyznotes.h5.classify.model.Classify;
import com.xyznotes.h5.common.exception.AppException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ClassifyService {
    @Resource
    private ClassifyMapper classifyMapper;

    @Transactional(rollbackFor = Exception.class)
    public void save(Classify classify) throws AppException {
        classifyMapper.save(classify);
    }

    public List<Classify> findByType(String type) throws AppException {
        return classifyMapper.findByType(type);
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Classify classify) {
        classifyMapper.update(classify);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Integer id) throws AppException {
        classifyMapper.deleteById(id);
    }

}
