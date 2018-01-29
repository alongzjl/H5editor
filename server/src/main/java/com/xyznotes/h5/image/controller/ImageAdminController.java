package com.xyznotes.h5.image.controller;

import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.image.model.Image;
import com.xyznotes.h5.image.service.ImageService;
import com.xyznotes.h5.user.model.UserToken;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;

/**
 * 图片库
 * Created by sunlong on 15/2/11.
 */
@RequestMapping("/api/image")
@Controller
@Auth
public class ImageAdminController {
    @Resource
    private ImageService imageService;

    @RequestMapping("/index")
    @ResponseBody
    public Result list(@RequestParam(defaultValue = "1") int page,
                       @RequestParam(defaultValue = "10") int pageSize,
                       @RequestAttribute("userid")UserToken userToken) throws AppException {
        Criteria criteria = new Criteria();
        criteria.page = page;
        criteria.pageSize = pageSize;
        criteria.conditionMap.put("is_public", 1);
        Page<Image> images = imageService.list(criteria);

        return new Result<>(true,images);
    }

    @RequestMapping("/create")
    @ResponseBody
    public Result create(Image image) throws AppException {
        if(image.getName() ==null || image.getPath() == null) {
            return new Result<>(false, "图片名称或者图片路径为空");
        } else {
            image.setPublic(true);
            image.setCreatedDate(new Date());
            imageService.save(image);
            return new Result();
        }
    }

    @RequestMapping("/delete")
    @ResponseBody
    public Result deleteById(Integer id) throws AppException {
        imageService.deleteById(id);
        return new Result();
    }
}
