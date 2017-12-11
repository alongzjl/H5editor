package com.xyznotes.h5.music.dao;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.music.model.Music;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by sl on 2014/9/22.
 */
@Mapper
public interface MusicMapper {
    long count(Criteria criteria);

    List<Music> list(Criteria criteria);

    boolean isNameExist(String name, Integer id, Boolean isPublic);

    void save(Music music);

    Music findById(Integer id);

    List<Music> findByMusicName(String musicName, Boolean isPublic);

    void update(Music music);

    void delete(Music music);

    List<Music> listAll(Criteria criteria);
}
