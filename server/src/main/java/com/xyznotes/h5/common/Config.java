package com.xyznotes.h5.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * User: sunlong
 * Date: 13-4-15
 * Time: 下午2:48
 */
@Component
public class Config {
    @Value("${web.domain}")
    private String domain;

    @Value("${upload.folder}")
    private String uploadFolder;

    @Value("${mail.host}")
    private String mailHost;

    @Value("${mail.username}")
    private String mailUsername;

    @Value("${mail.password}")
    private String mailPassword;

    private final int hashIterations = 256;
    private final String hashAlgorithm = "SHA-1";
    private final int saltSize = 8;

    @Value("${html.folder}")
    private String htmlFolder;

    @Value("${remote.api.domain}")
    private String remoteApiDomain;
    @Value("${base.domain}")
    private String baseDomain;

    public String getRemoteApiDomain() {
        return remoteApiDomain;
    }

    public int getHashIterations() {
        return hashIterations;
    }

    public String getHashAlgorithm() {
        return hashAlgorithm;
    }

    public int getSaltSize() {
        return saltSize;
    }

    public String getMailHost() {
        return mailHost;
    }

    public String getMailUsername() {
        return mailUsername;
    }

    public String getMailPassword() {
        return mailPassword;
    }

    public String getUploadFolder() {
        return checkSlash(uploadFolder);
    }


    public String getImageUploadFolder() {
        return checkSlash(uploadFolder) + "images";
    }

    public String getAudioUploadFolder() {
        return checkSlash(uploadFolder) + "audios";
    }

    public String getHtmlFolder() {
        return checkSlash(htmlFolder);
    }

    public String getDomain() {
        return domain;
    }
    public String getBaseDomain() {
        return baseDomain;
    }

    protected String checkSlash(String path) {
        if (!path.endsWith(File.separator)) {
            return path + "/";
        } else {
            return path;
        }
    }
}
