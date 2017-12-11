package com.xyznotes.h5.user.service;

import com.xyznotes.h5.common.*;
import com.xyznotes.h5.user.model.ResetToken;
import com.xyznotes.h5.user.model.Role;
import com.xyznotes.h5.user.model.User;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.user.dao.UserMapper;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * User: sunlong
 * Date: 13-1-30
 * Time: 下午5:10
 */
@Service("userService")
@Transactional(readOnly = true)
public class UserService implements IUserService{
    private UserMapper userMapper;
    private Config config;

    /**
     * 根据邮箱查找用户
     * @param email
     * @return
     * @throws AppException
     */
    @Override
    public User findUserByEmail(String email) throws AppException {
        User user = userMapper.findByEmail(email);
        if(user == null){
            throw new AppException(UserMessageCode.USER_NOT_EXIST_ERROR, email);
        }
        return user;
    }

    /**
     * 根据邮箱手机用户名查找用户
     * @param emailOrPhone
     * @throws AppException
     */
    @Override
    public User findUserByEmailOrPhone(String emailOrPhone) throws AppException {
        User user = userMapper.findByPhone(emailOrPhone);
        if(user == null){
            user = userMapper.findByEmail(emailOrPhone);

            if(user == null){
                throw new AppException(UserMessageCode.USER_NOT_EXIST_ERROR, emailOrPhone);
            }
        }
        return user;
    }

    /**
     * 管理员添加用户
     * @param user
     * @throws AppException
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(User user) throws AppException {
        user.setCreatedDate(new Date());
        user.setActive(true);
        if(user.getRole() == null){
            user.setRole(Role.USER);
        }

        if(user.getEmail() != null){
            User userByEmail = userMapper.findByEmail(user.getEmail());
            if(userByEmail != null){
                throw new AppException(UserMessageCode.USER_EMAIL_EXIST_ERROR, user.getEmail());
            }
        }

        if(user.getPhone()!=null){
            User userByPhone = userMapper.findByPhone(user.getPhone());
            if(userByPhone != null){
                throw new AppException(UserMessageCode.USER_PHONE_EXIST_ERROR, user.getPhone());
            }
        }

        if(user.getPassword() == null){
            user.setPassword("123456");
        }

        encryptPassword(user);
        userMapper.save(user);
    }

    @Override
    public Page<User> list(Criteria criteria) {
        long totalCount = userMapper.count(criteria);
        List<User> users = userMapper.list(criteria);
        return new Page<>(users, totalCount);
    }

    /**
     * 修改个人信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public User update(User user) throws AppException {
        User toSave = find(user.getId());

        checkEmail(user.getId(), user.getEmail());
        checkPhone(user.getId(), user.getPhone());

        toSave.setEmail(user.getEmail());
        toSave.setPhone(user.getPhone());
        toSave.setUsername(user.getUsername());
        toSave.setAvatar(user.getAvatar());
        toSave.setNickname(user.getNickname());

        userMapper.updateInfo(toSave);
        return toSave;
    }


    /**
     * 通过id，删除用户信息
     * @param id 用户id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) throws AppException {
        User user = find(id);
        if(user == null){
            throw new AppException(UserMessageCode.USER_NOT_EXIST_ERROR, id);
        }
        userMapper.delete(user);
    }

    /**
     * 根据ID查找用户
     */
    @Override
    public User find(Integer id) throws AppException {
        User user = userMapper.findById(id);
        if(user == null){
            throw new AppException(UserMessageCode.USER_NOT_EXIST_ERROR, id);
        }
        return user;
    }

    private void checkEmail(Integer userId, String email) throws AppException {
        User userByEmail = userMapper.findByEmail(email);
        if(userByEmail!=null && !userByEmail.getId().equals(userId)){
            throw new AppException(UserMessageCode.USER_EMAIL_EXIST_ERROR, email);
        }
    }

    private void checkPhone(Integer userId, String phone) throws AppException {
        User userByPhone = userMapper.findByPhone(phone);
        if(userByPhone!=null && !userByPhone.getId().equals(userId)){
            throw new AppException(UserMessageCode.USER_PHONE_EXIST_ERROR, phone);
        }
    }

    /**
     * 修改密码
     * @param newPassword
     * @throws AppException
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePassword(int id, String oldPassword, String newPassword) throws AppException {
        User toSave = find(id);

        String hashPassword = hashString(oldPassword, toSave.getSalt());
        if(!toSave.getPassword().equals(hashPassword)){
            throw new AppException(UserMessageCode.USER_OLD_PASSWORD_ERROR);
        }

        userMapper.updatePassword(id, hashString(newPassword, toSave.getSalt()));
    }

    /**
     * 重置密码
     * @param email
     * @param newPassword
     * @throws AppException
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(String email, String newPassword) throws AppException {
        if(newPassword.isEmpty()){
            throw new AppException(UserMessageCode.USER_PASSWORD_BLANK_ERROR);
        }
        User toSave = findUserByEmail(email);
        userMapper.updatePassword(toSave.getId(), hashString(newPassword, toSave.getSalt()));
    }

    /**
     * 设定安全的密码，生成随机的salt并经过多次 sha-1 hash
     */
    private void encryptPassword(User user) {
        byte[] salt = Digests.generateSalt(config.getSaltSize());
        user.setSalt(Hex.encodeHexString(salt));

        byte[] hashPassword = Digests.sha1(user.getPassword().getBytes(), salt, config.getHashIterations());
        user.setPassword(Hex.encodeHexString(hashPassword));
    }

    private String hashString(String password, String salt) throws AppException {
        try {
            return Hex.encodeHexString(Digests.sha1(password.getBytes(), Hex.decodeHex(salt.toCharArray()), config.getHashIterations()));
        } catch (DecoderException e) {
            throw new AppException(CommonMessageCode.HEX_DECODE_EXCEPTION_ERROR);
        }
    }

    /**
     *创建resetToken
     * @param email
     * @return
     * @throws AppException
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ResetToken saveResetToken(String email) throws AppException {
        ResetToken token = new ResetToken();
        token.setEmail(email);
        token.setSalt(Hex.encodeHexString(Digests.generateSalt(config.getSaltSize())));
        token.setCreatedDate(new Date());
        token.setValid(true);
        String code = hashString(email+token.getSalt(), token.getSalt());
        token.setCode(code);
        //先验证code是否已存在
        ResetToken resetToken = userMapper.findResetToken(code);
        if(resetToken != null){
            throw new AppException(UserMessageCode.RESET_TOKEN_EXIST_ERROR);
        }
        userMapper.saveResetToken(token);
        return token;
    }

    /**
     * 根据code查找resetToken
     * @param code
     * @return
     * @throws AppException
     */
    @Override
    public ResetToken findResetToken(String code) throws AppException {
        ResetToken resetToken = userMapper.findResetToken(code);
        if(resetToken == null){
            throw new AppException(UserMessageCode.RESET_TOKEN_NOT_EXIST_ERROR);
        }
        return resetToken;
    }

    /**
     * 删除resetToken
     * @param resetToken
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void invalid(ResetToken resetToken) {
        userMapper.invalid(resetToken);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Integer userId, int operatorId) throws AppException {
        checkPermission(userId, operatorId);
        userMapper.changeStatus(userId, false);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Integer userId, int operatorId) throws AppException {
        checkPermission(userId, operatorId);
        userMapper.changeStatus(userId, true);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(int id, int operatorId, String password) throws AppException {
        if(password.isEmpty()){
            throw new AppException(UserMessageCode.USER_PASSWORD_BLANK_ERROR);
        }
        User toSave = find(id);
        if(checkPermission(id, operatorId)){
            userMapper.updatePassword(id, hashString(password, toSave.getSalt()));
        }else{
            throw new AppException(MessageCode.PERMISSION_ERROR);
        }
    }

    private boolean checkPermission(int userId, int operatorId) throws AppException {
        User operator = find(operatorId);
        return operator.getRole() == Role.ADMIN || (userId == operatorId);
    }

    @Resource
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Resource
    public void setConfig(Config config) {
        this.config = config;
    }
}
