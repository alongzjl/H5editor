package com.xyznotes.h5.upload.controller;

import com.xyznotes.h5.common.CommonMessageCode;
import com.xyznotes.h5.common.Config;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.image.model.Image;
import com.xyznotes.h5.image.service.ImageService;
import com.xyznotes.h5.music.model.Music;
import com.xyznotes.h5.music.service.MusicService;
import com.xyznotes.h5.user.model.UserToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;

/**
 * Created by sunlong on 2016/11/11.
 */
@RestController
@RequestMapping("/api")
@Auth
public class UploadController {
    private Config config;
    @Resource
    private ImageService imageService;
    @Resource
    private MusicService musicService;

    @PostMapping("/upload/image")
    public Result upload(MultipartFile file, Boolean isPublic, @RequestAttribute("userid")UserToken userToken) throws AppException {
        String path = this.upload(config.getImageUploadFolder(), file);
        if(path.length() > 50) {
            throw new AppException(MessageCode.FILENAME_TOO_LONG);
        }
        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setPath(path);
        image.setPublic(isPublic);
        image.setCreatedDate(new Date());
        image.setUserId(userToken.getId());
        imageService.save(image);
        return new UploadResult(true, image.getId(), path, config.getDomain());
    }

    @PostMapping("/upload/music")
    public Result upload2(MultipartFile file, Boolean isPublic, @RequestAttribute("userid")UserToken userToken) throws AppException {
        String path = this.upload(config.getAudioUploadFolder(), file);
        Music music = new Music();
        music.setMusicName(file.getOriginalFilename());
        music.setMusicPath(path);
        music.setPublic(isPublic);
        music.setUserId(userToken.getId());
        musicService.save(music);
        return new UploadResult(true, music.getId(), path, config.getDomain());
    }

    private String upload(String folder, MultipartFile file) throws AppException {
        if(!folder.endsWith(File.separator)){
            folder = folder + "/";
        }

        if(!new File(folder).exists()){
            new File(folder).mkdirs();
        }

        String name = file.getOriginalFilename();
        // Make sure the fileName is unique
        if(new File(folder + name).exists()){
            int index = name.lastIndexOf(".");
            String fileName = name.substring(0, index);
            String ext = name.substring(index);
            int count = 1;
            File aFile = new File(folder + fileName + "_" + count + ext);
            while (aFile.exists()){
                count++;
                aFile = new File(folder + fileName + "_" + count + ext);
            }
            name = fileName + "_" + count + ext;
        }

        String filePath = folder + name;

        if(!file.isEmpty()){//如果不空
            try {
                Files.copy(file.getInputStream(), Paths.get(folder).resolve(name));
            } catch (IOException e) {
                throw new AppException(CommonMessageCode.FILE_WRITE_ERROR, e.getMessage());
            }
        }
        return filePath.substring(config.getUploadFolder().length());
    }

    @Resource
    public void setConfig(Config config) {
        this.config = config;
    }
}

class UploadResult extends Result{
    UploadResult(boolean success, String filePath, String imageDomain){
        super(success, filePath);
        this.file_path = imageDomain + filePath;
    }

    UploadResult(boolean success, Integer id, String filePath, String imageDomain){
        super(success, filePath);
        this.id = id;
        this.file_path = imageDomain + filePath;
    }

    private String file_path;

    private Integer id;

    public String getFile_path() {
        return file_path;
    }

    public Integer getId() {
        return id;
    }
}
