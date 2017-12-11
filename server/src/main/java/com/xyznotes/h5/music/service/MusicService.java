package com.xyznotes.h5.music.service;

import com.xyznotes.h5.category.dao.CategoryMapper;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.music.dao.MusicMapper;
import com.xyznotes.h5.music.model.Music;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * Created by sl on 2014/9/22.
 */
@Transactional(readOnly = true)
@Service
public class MusicService {
    @Resource
    private MusicMapper musicMapper;
    @Resource
    private CategoryMapper categoryMapper;

    public Page<Music> list(Criteria criteria) {
        long totalCount = musicMapper.count(criteria);
        List<Music> musics = musicMapper.list(criteria);
        musics.forEach(music->{
            music.setCategoryName(categoryMapper.findById(music.getCategoryId()).getName());
        });
        return new PageImpl<>(musics, new PageRequest(criteria.page - 1, criteria.pageSize), totalCount);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Music music) throws AppException {
        music.setCreateTime(new Date());
        musicMapper.save(music);
    }

    public Music findById(Integer id) throws AppException {
        Music music = musicMapper.findById(id);
        if (music == null) {
            throw new AppException(MessageCode.MUSIC_NOT_EXIST_ERROR, id);
        }
        return music;
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Music music) throws AppException {
        music.setPublic(true);
        musicMapper.update(music);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) throws AppException {
        Music music = findById(id);
        musicMapper.delete(music);
    }

    public List<Music> listAll(Criteria criteria) {
        return musicMapper.listAll(criteria);
    }
}
