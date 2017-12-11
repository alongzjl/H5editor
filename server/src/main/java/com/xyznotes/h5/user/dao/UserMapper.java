package com.xyznotes.h5.user.dao;

import com.xyznotes.h5.user.model.ResetToken;
import com.xyznotes.h5.user.model.User;
import com.xyznotes.h5.common.Criteria;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.List;

/**
 * User: sunlong
 * Date: 13-12-3
 * Time: 上午9:14
 */
@Mapper
@Validated
public interface UserMapper {
    User findByEmail(String email);

    void save(@Valid User user);

    User findById(Integer id);

    void delete(User user);

    void updatePassword(int id, String password);

    void changeStatus(Integer id, boolean active);

    void updateLoginDate(User toSave);

    void updateInfo(@Valid User toSave);

    ResetToken findResetToken(String code);

    void saveResetToken(ResetToken token);

    void invalid(ResetToken resetToken);

    long count(Criteria criteria);

    List<User> list(Criteria criteria);

    User findByPhone(String phone);

    User findByOpenid(String openid);
}
