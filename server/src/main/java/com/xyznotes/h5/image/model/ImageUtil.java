package com.xyznotes.h5.image.model;

import com.xyznotes.h5.common.Config;
import com.xyznotes.h5.common.MessageCode;
import com.xyznotes.h5.common.exception.AppException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.UUID;

/**
 * Created by sunlong on 15/7/9.
 */
public class ImageUtil {

    public static String crop(String path, String folder, Crop crop, Config config) throws AppException {
        String suffix = path.substring(path.lastIndexOf("."));
        InputStream is = null;
        FileOutputStream fos = null;
        try {
            URL fileUri = new URL("http:// .b0.upaiyun.com" + path);
            is = fileUri.openStream();

            File pictureFolder = new File(config.getImageUploadFolder());
            if(!pictureFolder.exists()){
                pictureFolder.mkdirs();
            }

            String fileName = UUID.randomUUID().toString() + suffix;
            File tmpImg = new File(config.getImageUploadFolder() + fileName);
            fos = new FileOutputStream(tmpImg);

            byte[] buffer = new byte[4096];
            int length;
            while ((length = is.read(buffer)) != -1) {
                fos.write(buffer, 0, length);
            }

            //todo: crop
            tmpImg.delete();

            return "";
        } catch (IOException e) {
            e.printStackTrace();
            throw new AppException(MessageCode.IMAGE_CROP_ERROR);
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            if(is != null){
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
