package com.xyznotes.h5.common;

/**
 * User: sunlong
 * Date: 13-4-15
 * Time: 下午3:01
 */
public enum MessageCode implements IMsgCode {
    FILE_NAME_NOT_EXIST_ERROR,
    FILE_MAKE_FOLDER_ERROR,
    MAIL_SEND_ERROR,
    PERMISSION_ERROR,

    TEMPLATE_EXIST_ERROR,
    TEMPLATE_NOT_EXIST_ERROR,
    TEMPLATE_INDEX_FILE_NOT_EXIST_ERROR,
    TEMPLATE_PARSE_ERROR,
    TEMPLATE_IMAGE_NOT_EXIST_ERROR,
    TEMPLATE_NOT_AVAILABLE_ERROR,

    MUSIC_EXIST_ERROR,
    MUSIC_NOT_EXIST_ERROR,


    COURSE_NOT_EXIST_ERROR,
    COURSE_PAGE_NULL_ERROR,
    COURSE_INVALID_DELETE_ERROR,
    COURSE_INVALID_UPDATE_ERROR,
    COURSE_TYPE_NOT_EXIST_ERROR,

    ATTENTION_NOT_EXIST_ERROR,

    TEMPLATEGROUP_NAME_EXIST_ERROR,

    TEMPLATEGROUP_NOT_EXIST_ERROR,

    NOT_PCTOAPPLY_ERROR,

    USER_PHONE_OR_OPENID_EXIST_ERROR,

    WXPUBLICSETTING_NO_APPIDANDSECRET_ERROR,

    WX_API_UNAUTHORIZED_ERROR,

    WX_OUT_OF_LIMIT_ERROR,

    WX_DATE_FORMAT_ERROR,

    WX_ERROR,

    TEMPLATEPAGE_NOT_EXIST_ERROR,

    IMAGECATEGORY_EXIST_ERROR,

    TEMPLATEGROUP_NUMBER_EXIST_ERROR,

    IMAGECATEGORY_CATEGORYNO_EXIST_ERROR,

    IMAGE_CROP_ERROR,
    IMAGE_UPLOAD_ERROR,

    PRODUCT_NOT_EXIST_ERROR,

    ORDER_NOT_EXIST_ERROR,
    USER_NOT_MEMBER_ERROR,
    ACCESS_DENIED_ERROR,

    SESSION_ID_NOT_EXIST_ERROR,

    CODE_GET_FAILURE,

    PICTURE_EXIST_ERROR,

    SUBSCRIBE_EXIST_ERROR,

    CONTENT_NOT_NULL,

    USERINFO_NOT_COMPLETE,

    FILENAME_TOO_LONG,
    COURSE_COPY_ERROR,
}
