package com.xyznotes.h5.user.service;

import com.xyznotes.h5.user.model.ResetToken;
import com.xyznotes.h5.user.model.User;
import com.xyznotes.h5.common.Criteria;
import com.xyznotes.h5.common.Page;
import com.xyznotes.h5.common.exception.AppException;

/**
 * Created by long on 2015/1/15.
 */
public interface IUserService {
    User findUserByEmail(String email) throws AppException;

    /**
     * 根据邮箱手机用户名查找用户
     * @throws AppException
     */
    User findUserByEmailOrPhone(String emailOrPhone) throws AppException;

    /**
     * 管理员添加用户
     * @throws AppException
     */
    void create(User user) throws AppException;

    Page<User> list(Criteria criteria);

    /**
     * 修改用户信息
     */
    User update(User user) throws AppException;

    /**
     * 通过id，删除用户信息
     * @param id 用户id
     * @throws AppException
     */
    void delete(Integer id) throws AppException;

    /**
     * 根据ID查找用户
     * @throws AppException
     */
    User find(Integer id) throws AppException;


    /**
     * 修改密码
     * @throws AppException
     */
    void updatePassword(int id, String oldPassword, String newPassword) throws AppException;

    /**
     * 重置密码
     * @throws AppException
     */
    void resetPassword(String email, String newPassword) throws AppException;

    /**
     *创建resetToken
     * @throws AppException
     */
    ResetToken saveResetToken(String email) throws AppException;

    /**
     * 根据code查找resetToken
     * @throws AppException
     */
    ResetToken findResetToken(String code) throws AppException;

    /**
     * 使resetToken失效
     */
    void invalid(ResetToken resetToken);

    /**
     * 禁止用户
     * @param userId
     * @throws AppException
     */
    void disable(Integer userId, int operatorId) throws AppException;

    /**
     * 启用用户
     * @param userId
     * @throws AppException
     */
    void enable(Integer userId, int operatorId) throws AppException;

    void resetPassword(int id, int operatorId, String password) throws AppException;
}
