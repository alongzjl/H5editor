package com.xyznotes.h5.image.controller;

import com.xyznotes.h5.common.Config;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.image.service.ImageService;
import com.xyznotes.h5.user.model.UserToken;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * Created by sunlong on 15/2/11.
 */
@Controller
@RequestMapping("/api")
@Auth
public class ImageController {
    @Resource
    private ImageService imageService;
    @Resource
    private Config config;


    /**
     * 异步获取图片
     */
    @RequestMapping("/images")
    @ResponseBody
    public Result list(@RequestParam(defaultValue = "1") int page,
                       @RequestParam(defaultValue = "20") int pageSize,
                       String keyword,
                       Boolean isPublic, Integer categoryId, @RequestAttribute("userid") UserToken userToken) throws AppException {
        Criteria criteria = new Criteria();
        criteria.page = page;
        criteria.pageSize = pageSize;

        criteria.orderName = "created_date";
        criteria.orderName = Criteria.Order.DESC;

        if (categoryId > 0 && isPublic) {
            criteria.conditionMap.put("category_id", categoryId);
        }

        if (!isPublic) {
            criteria.conditionMap.put("user_id", userToken.getId());
        }else{
            criteria.conditionMap.put("is_public", true);
        }

        if (StringUtils.isNotBlank(keyword)) {
            criteria.conditionMap.put("keyword", keyword);
        }

        return new Result<>(true, imageService.list(criteria));
    }

    @PostMapping("/image")
    @ResponseBody
    public Result create(Integer[] ids, Integer categoryId) throws AppException {
        for (int id : ids) {
            imageService.update(id, categoryId);
        }
        return new Result<>();
    }

    @DeleteMapping("/image/{imageId}")
    @ResponseBody
    public Result deleteFile(@PathVariable Integer imageId) throws AppException {
        imageService.deleteById(imageId);
        return new Result();
    }

    @RequestMapping("/image/crop")
    @ResponseBody
    public Result crop(MultipartFile image, @RequestAttribute("userid") UserToken userToken) throws AppException {
        String path = config.getImageUploadFolder();
        String type = image.getContentType().substring(image.getContentType().indexOf('/')+1);
        String filePath = path  + "/" + UUID.randomUUID().toString() + "." + type;
        try {
            image.transferTo(new File(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new Result<>(true, filePath.substring(config.getUploadFolder().length()));
    }

}
