package com.xyznotes.h5.user.controller;

import com.auth0.jwt.JWTSigner;
import com.xyznotes.h5.common.*;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.common.security.interceptor.SecurityInterceptor;
import com.xyznotes.h5.user.model.*;
import com.xyznotes.h5.user.service.IUserService;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by sunlong on 2015/8/4.
 */
@RestController
@RequestMapping("/api")
@Auth
public class UserController {
    private IUserService userService;
    private Config config;
    private final RestTemplate template = new RestTemplate();
    private static Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);

    /**
     * 登录
     *
     * @throws AppException
     */
    @RequestMapping(value = "/user/login", method = RequestMethod.POST)
    @Auth("anon")
    public Result login(String emailOrPhone, String password) throws Exception {
        logger.error("email:" + emailOrPhone + "&pwd:" + password);
        //调用登陆接口，获取身份信息。
        LoginResponseBody responseEntity =  template.getForObject(config.getRemoteApiDomain() + "/wordoor_uaas_api/v1/auth/sessions/create?acc=" + emailOrPhone + "&pwd=" + password, LoginResponseBody.class);
        //logger.error("Here is some error with " + JSON.toJSONString(responseEntity));
        if(responseEntity == null){
            logger.info("登录返回错误，接口异常");
            return new Result<>(false, "登录接口异常，请联系管理员");
        }
        if(!responseEntity.getSuccess()){
            logger.info("登录返回错误，错误码是"+responseEntity.getCode());
            return new Result<>(false, "用户名或密码不正确");
        }
        AccountInfo result = responseEntity.getResult().getAcct();
        return new Result<>(true, sign(new UserToken(result.getId(), result.getUtype(), result.getAvatar(), result.getName(), new Date().getTime())));
    }

    private String sign(UserToken userToken){
        JWTSigner signer = new JWTSigner("odfa0618");
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userToken.getId());
        claims.put("role", userToken.getRole());
        claims.put("name", userToken.getName());
        claims.put("avatar", userToken.getAvatar());
        claims.put("datetime", userToken.getDatetime());
        return signer.sign(claims);
    }

    private String hashString(String password, String salt) throws AppException {
        try {
            return Hex.encodeHexString(Digests.sha1(password.getBytes(), Hex.decodeHex(salt.toCharArray()), config.getHashIterations()));
        } catch (DecoderException e) {
            throw new AppException(CommonMessageCode.HEX_DECODE_EXCEPTION_ERROR);
        }
    }

    /**
     * 获取个人信息
     *
     * @throws AppException
     */
    @RequestMapping(value = "/user/info", method = RequestMethod.GET)
    public Result showInfo(@RequestAttribute("userid") UserToken userToken) throws AppException {
        return new Result<>(true, userService.find(userToken.getId()));
    }

    /**
     * 修改个人信息
     *
     * @throws AppException
     */
    @RequestMapping(value = "/user/info", method = RequestMethod.PUT)
    public Result changeInfo(User user, @RequestAttribute("userid") UserToken userToken) throws AppException {
        user.setId(userToken.getId());
        userService.update(user);
        return new Result();
    }

    /**
     * 修改密码
     *
     * @throws AppException
     */
    @RequestMapping(value = "/user/password", method = RequestMethod.PUT)
    public Result changePass(String oldPassword, String password, String rePassword, @RequestAttribute("userid") UserToken userToken) throws AppException {
        if (StringUtils.isBlank(password)) {
            throw new AppException(UserMessageCode.USER_NEW_PASSWORD_BLANK_ERROR);
        }
        if (!rePassword.equals(password)) {
            throw new AppException(UserMessageCode.USER_TWICE_PASSWORD_NOT_EQUAL_ERROR);
        }
        userService.updatePassword(userToken.getId(), oldPassword, password);
        return new Result();
    }

    /**
     * 发送邮件，找回密码
     * @throws AppException
     */
    @RequestMapping(value = "/user/forgetPassword", method = RequestMethod.POST)
    public Result forgetPassword2(String email) throws AppException {
        User user = userService.findUserByEmail(email);
        try {
            ResetToken token = userService.saveResetToken(email);
            String emailTitle = "用户密码找回";
            String basePath = config.getDomain();
            String resetPassHref = basePath + "user/reset?token=" + token.getCode();
            String emailContent = "点击下面的链接,重设密码\n" + resetPassHref +  "\n本邮件超过1天时间,链接将会失效，需要重新'找回密码'";
            EmailUtils.sendHtmlEmail(config, emailTitle, emailContent, user.getEmail());
        } catch (MessagingException e) {
            throw new AppException(MessageCode.MAIL_SEND_ERROR);
        }
        return new Result();
    }

    /**
     * 重置密码
     *
     * @throws AppException
     */
    @RequestMapping(value = "/user/reset", method = RequestMethod.POST)
    public Result reset(String token, String password, String confirmPassword) throws AppException {
        ResetToken resetToken = userService.findResetToken(token);
        if (password.isEmpty() && confirmPassword.isEmpty()) {
            throw new AppException(UserMessageCode.USER_PASSWORD_BLANK_ERROR);
        }
        if (!password.equals(confirmPassword)) {
            throw new AppException(UserMessageCode.USER_TWICE_PASSWORD_NOT_EQUAL_ERROR);
        }
        String email = resetToken.getEmail();
        userService.resetPassword(email, password);
        userService.invalid(resetToken);
        return new Result();
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    @Resource
    public void setConfig(Config config) {
        this.config = config;
    }
}
