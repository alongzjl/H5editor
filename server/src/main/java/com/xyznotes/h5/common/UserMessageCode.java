package com.xyznotes.h5.common;

/**
 * Created by sunlong on 2014/11/4.
 */
public enum UserMessageCode implements IMsgCode {
    USER_GET_AUTHENTICATION_INFO_ERROR,
    USER_EXIST_ERROR,
    USER_NOT_EXIST_ERROR,
    USER_EMAIL_EXIST_ERROR,
    USER_NEW_PASSWORD_BLANK_ERROR,
    USER_TWICE_PASSWORD_NOT_EQUAL_ERROR,
    USER_OLD_PASSWORD_ERROR,
    USER_PASSWORD_BLANK_ERROR,
    USER_NOT_LOGIN_ERROR,
    USER_EMAIL_OR_PHONE_EMPTY_ERROR,
    USER_PHONE_EXIST_ERROR,
    USER_TWICE_CODE_NOT_EQUAL_ERROR,
    USER_DISABLED_ERROR,

    ROLE_EXIST_ERROR,
    ROLE_NOT_EXIST_ERROR,
    ROLE_ID_NOT_EXIST_ERROR,
    ROLE_DELETE_DEFAULT_ERROR,
    ROLE_UPDATE_DEFAULT_ROLE_NAME_ERROR,

    RESET_TOKEN_NOT_EXIST_ERROR,
    RESET_TOKEN_EXIST_ERROR,
    RESET_TOKEN_INVALID_ERROR

}
