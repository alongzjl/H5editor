package com.xyznotes.h5.statistics.service;

import com.xyznotes.h5.statistics.dao.StatisticsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

/**
 * Created by sunlong on 2014/9/22.
 */
@Transactional(readOnly = true)
@Service
public class StatisticsService {
    @Resource
    private StatisticsMapper statisticsMapper;

}
