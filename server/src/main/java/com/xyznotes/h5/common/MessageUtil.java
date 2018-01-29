package com.xyznotes.h5.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.text.MessageFormat;
import java.util.*;

/**
 * User: sunlong
 * Date: 13-2-28
 * Time: 上午11:40
 */
public class MessageUtil {
    private Logger logger = LoggerFactory.getLogger(MessageUtil.class);

    private String[] basenames;
    private final Map<String, Map<Locale, ResourceBundle>> cachedResourceBundles = new HashMap<>();

    public String getMessage(String value){
        return getMessage(value, null, null);
    }

    public String getMessage(String value, Object[] args){
        return getMessage(value, args, null);
    }

    public String getMessage(String value, Locale locale){
        return getMessage(value, null, locale);
    }

    public String getMessage(IMsgCode value){
        return getMessage(value.toString(), null, null);
    }

    public String getMessage(IMsgCode value, Object[] args){
        return getMessage(value.toString(), args, null);
    }

    public String getMessage(IMsgCode value, Locale locale){
        return getMessage(value.toString(), null, locale);
    }

    public String getMessage(String value, Object[] args, Locale locale){
        if(locale == null){
            locale = Locale.CHINA;
        }
        String key = value.toLowerCase().replaceAll("_", ".");

        String result = null;
        for (String basename : this.basenames) {
            ResourceBundle bundle = getResourceBundle(basename, locale);
            if (bundle != null) {
                try {
                    result = MessageFormat.format(bundle.getString(key), args);
                    break;
                }catch (MissingResourceException e){
                    logger.error("cant not find " + key + " in " + basename, e);
                }
            }
        }
        return result;
    }

    protected ResourceBundle getResourceBundle(String basename, Locale locale) {
        synchronized (this.cachedResourceBundles) {
            Map<Locale, ResourceBundle> localeMap = this.cachedResourceBundles.get(basename);
            if (localeMap != null) {
                ResourceBundle bundle = localeMap.get(locale);
                if (bundle != null) {
                    return bundle;
                }
            }
            ResourceBundle bundle = PropertyResourceBundle.getBundle(basename, locale);
            if (localeMap == null) {
                localeMap = new HashMap<>();
                this.cachedResourceBundles.put(basename, localeMap);
            }
            localeMap.put(locale, bundle);
            return bundle;
        }
    }

    public void setBasenames(String... basenames)  {
        if (basenames != null) {
            this.basenames = new String[basenames.length];
            for (int i = 0; i < basenames.length; i++) {
                String basename = basenames[i];
                Assert.hasText(basename, "Basename must not be empty");
                this.basenames[i] = basename.trim();
            }
        } else {
            this.basenames = new String[0];
        }
    }
}
