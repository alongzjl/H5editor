package com.xyznotes.h5.user.controller;

import com.xyznotes.h5.user.service.IUserService;
import com.xyznotes.h5.user.model.User;
import com.xyznotes.h5.user.model.UserToken;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Page;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.UserMessageCode;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * User: sunlong
 * Date: 13-1-30
 * Time: 下午5:40
 */
@RestController
@RequestMapping("/api")
@Auth
public class UserAdminController {
    private IUserService userService;

    /**
     * 查看会员用户
     */
    @RequestMapping(value = "/users")
    public Result list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) throws AppException {
        Criteria criteria = new Criteria(page, pageSize, "created_date", Criteria.Order.DESC);
        Page<User> users = userService.list(criteria);
        return new Result<>(true, users);
    }

    /**
     * 禁用用户
     */
    @PutMapping(value = "/user/disable/{id}")
    public Result disable(@PathVariable Integer id, @RequestAttribute("userid")UserToken userToken) throws AppException {
        userService.disable(id, userToken.getId());
        return new Result();
    }

    /**
     * 启用用户
     */
    @PutMapping(value = "/user/enable/{id}")
    public Result enable(@PathVariable Integer id, @RequestAttribute("userid")UserToken userToken) throws AppException {
        userService.enable(id, userToken.getId());
        return new Result();
    }

    /**
     * 管理员修改用户信息
     */
    @PutMapping(value = "/user/{id}")
    public Result update(@RequestBody User user) throws AppException {
        userService.update(user);
        return new Result();
    }

    /**
     * 管理员重置用户密码
     */
    @PutMapping(value = "/user/password/reset")
    public Result reset(Integer id, String password, String rePassword, @RequestAttribute("userid")UserToken userToken) throws AppException {
        if(!password.equals(rePassword)){
            throw new AppException(UserMessageCode.USER_TWICE_PASSWORD_NOT_EQUAL_ERROR);
        }
        userService.resetPassword(id, userToken.getId(), password);
        return new Result();
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }
}
