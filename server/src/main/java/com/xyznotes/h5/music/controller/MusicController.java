package com.xyznotes.h5.music.controller;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.music.model.Music;
import com.xyznotes.h5.music.service.MusicService;
import com.xyznotes.h5.user.model.UserToken;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;


@Controller
@RequestMapping("/api")
@Auth
public class MusicController {
    @Resource
    private MusicService musicService;

    @PostMapping(value = "/music")
    @ResponseBody
    public Result add(Integer[] ids, Integer categoryId) throws AppException {
        for(Integer id: ids){
            musicService.update(new Music(id, categoryId));
        }
        return new Result<>();
    }

    /**
     * 异步获取
     */
    @RequestMapping("/musics")
    @ResponseBody
    public Result list(@RequestParam(defaultValue = "1") int page,
                       @RequestParam(defaultValue = "10") int pageSize,
                       Boolean isPublic, Integer categoryId, @RequestAttribute("userid") UserToken userToken) throws AppException {
        Criteria criteria = new Criteria();
        criteria.page = page;
        criteria.pageSize = pageSize;
        criteria.conditionMap.put("is_public", isPublic);

        if (categoryId!=null && categoryId != 0) {
            if (categoryId == -1) {
                criteria.orderName = "created_date";
                criteria.orderName = Criteria.Order.DESC;
            } else if(categoryId > 0 && isPublic){
                criteria.conditionMap.put("category_id", categoryId);
            }
        }

        if (!isPublic) {
            criteria.conditionMap.put("user_id", userToken.getId());
        }

        return new Result<>(true, musicService.list(criteria));
    }

    /**
     * 异步获取
     */
    @RequestMapping("/musics/all")
    @ResponseBody
    public Result listAll(Boolean isPublic, Integer categoryId, String keyword, @RequestAttribute("userid") UserToken userToken) throws AppException {
        Criteria criteria = new Criteria();
        criteria.conditionMap.put("is_public", isPublic);
        if (!isPublic) {
            criteria.conditionMap.put("user_id", userToken.getId());
        }
        if (categoryId != 0) {
            if (categoryId == -1) {
                criteria.orderName = "created_date";
                criteria.orderName = Criteria.Order.DESC;
            } else if(isPublic){
                criteria.conditionMap.put("category_id", categoryId);
            }
        }
        if(StringUtils.isNotBlank(keyword)){
            criteria.conditionMap.put("keyword", keyword);
        }
        return new Result<>(true, musicService.listAll(criteria));
    }

    /**
     * 删除我的音乐库
     */
    @DeleteMapping(value = "/music/{musicId}")
    @ResponseBody
    public Result deleteUserMusic(@PathVariable Integer musicId) throws AppException {
        musicService.delete(musicId);
        return new Result();
    }
}