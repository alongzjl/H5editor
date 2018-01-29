package com.xyznotes.h5.common;

/**
 * User: sunlong
 * Date: 13-4-15
 * Time: 下午3:01
 */
public enum CommonMessageCode implements IMsgCode{
    SERVER_ERROR,
    HEX_DECODE_EXCEPTION_ERROR,
    DATA_INTEGRITY_VIOLATION_EXCEPTION_ERROR,
    VALIDATION_ERROR,
    ACCESS_DENIED_ERROR,
    UNSUPPORTED_ENCODING_EXCEPTION_ERROR,

    FILE_WRITE_ERROR,
}
