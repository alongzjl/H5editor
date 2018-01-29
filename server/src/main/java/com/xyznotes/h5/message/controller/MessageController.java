package com.xyznotes.h5.message.controller;

import com.xyznotes.h5.message.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    @MessageMapping("/page/flip")
    @SendTo("/topic/flip")
    public Message flip(Message message) throws Exception {
        return message;
    }
}
