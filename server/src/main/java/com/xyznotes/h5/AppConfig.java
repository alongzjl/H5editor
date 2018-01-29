package com.xyznotes.h5;

import com.xyznotes.h5.common.MessageUtil;
import com.xyznotes.h5.common.security.interceptor.SecurityInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.validation.Validator;

/**
 * Created by sunlong on 2016/10/29.
 */
@Configuration
@MapperScan("com.xyznotes.h5")
public class AppConfig extends WebMvcConfigurerAdapter {

    @Bean
    public MessageUtil newMessageUtil() {
        MessageUtil util = new MessageUtil();
        util.setBasenames("messages");
        return util;
    }

    @Bean
    public SecurityInterceptor newSecurityInterceptor() {
        return new SecurityInterceptor();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedHeaders("*")
                        .allowedMethods("*")
                        .allowedOrigins("*");
            }
        };
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(newSecurityInterceptor());
    }

    @Bean
    public Validator validator() {
        return new LocalValidatorFactoryBean();
    }
}
