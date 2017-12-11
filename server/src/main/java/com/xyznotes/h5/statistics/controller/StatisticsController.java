package com.xyznotes.h5.statistics.controller;


import com.xyznotes.h5.common.security.interceptor.Auth;
import com.xyznotes.h5.common.security.interceptor.AuthType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/statistics")
@Auth
public class StatisticsController {

}