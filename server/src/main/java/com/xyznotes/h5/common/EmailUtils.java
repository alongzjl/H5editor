package com.xyznotes.h5.common;

import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

/**
 * Created by sunlong on 2015/5/13.
 */
public class EmailUtils {

    /**
     * 发送邮件
     */
    public static void sendHtmlEmail(Config config, String emailTitle, String emailContent, String email) throws MessagingException {
        JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();

        //设定mail server
        senderImpl.setHost(config.getMailHost());

        //建立邮件消息,发送简单邮件和html邮件的区别
        MimeMessage mailMessage = senderImpl.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage);

        //设置收件人，寄件人
        messageHelper.setTo(email);
        messageHelper.setFrom(config.getMailUsername());
        messageHelper.setSubject(emailTitle);
        messageHelper.setText(emailContent);

        senderImpl.setUsername(config.getMailUsername());
        senderImpl.setPassword(config.getMailPassword());
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true"); // 将这个参数设为true，让服务器进行认证,认证用户名和密码是否正确
        prop.put("mail.smtp.timeout", "25000");
        senderImpl.setJavaMailProperties(prop);
        //发送邮件
        senderImpl.send(mailMessage);
    }
}
