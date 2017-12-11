package com.xyznotes.h5.classify.dao;

import com.xyznotes.h5.classify.model.Classify;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ClassifyMapper {
    void save(Classify classify);

    List<Classify> findByType(@Param("type") String type);

    void update(Classify classify);

    void deleteById(@Param("id") Integer id);
}
