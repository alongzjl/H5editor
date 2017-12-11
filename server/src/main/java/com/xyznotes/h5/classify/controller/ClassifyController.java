package com.xyznotes.h5.classify.controller;

/**
 * 用途 风格
 */
import com.xyznotes.h5.classify.model.Classify;
import com.xyznotes.h5.classify.service.ClassifyService;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RequestMapping("/api")
@Controller
@Auth
public class ClassifyController {
    @Resource
    private ClassifyService classifyService;

    @RequestMapping("/classifies")
    @ResponseBody
    public Result listClassifies(@RequestParam(required = false) String type) throws AppException {
        List<Classify> classifies = classifyService.findByType(type);
        return new Result<>(true, classifies);
    }

    @PostMapping("/classify")
    @ResponseBody
    public Result create(@RequestBody Classify classify) throws AppException {
        classifyService.save(classify);
        return new Result<>();
    }

    @PutMapping("/classify/{id}")
    @ResponseBody
    public Result update(@RequestBody Classify classify) throws AppException {
        classifyService.update(classify);
        return new Result<>();
    }

    @DeleteMapping("/classify/{id}")
    @ResponseBody
    public Result delete(@PathVariable Integer id) throws AppException {
        classifyService.deleteById(id);
        return new Result<>();
    }

}