package com.xyznotes.h5.category.controller;

import com.xyznotes.h5.category.model.Category;
import com.xyznotes.h5.category.service.CategoryService;
import com.xyznotes.h5.common.Result;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.common.security.interceptor.Auth;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 分类
 * Created by sunlong on 15/2/11.
 */
@RequestMapping("/api")
@Controller
@Auth
public class CategoryController {
    @Resource
    private CategoryService categoryService;

    /**
     * 异步获取子分类
     */
    @RequestMapping("/categories")
    @ResponseBody
    public Result listCategories(@RequestParam(required = false) Integer parentCategoryId,
                                 @RequestParam(required = false) String type) throws AppException {
        List<Category> categories = categoryService.findByParentAndType(parentCategoryId, type);
        for(Category category: categories){
            List<Category> categoryList = categoryService.findByParent(category.getId());
            category.setChildren(categoryList);
        }
        return new Result<>(true,categories);
    }

    @DeleteMapping("/category/{id}")
    @ResponseBody
    public Result delete(@PathVariable Integer id) throws AppException {
        categoryService.deleteById(id);
        return new Result<>();
    }

    @PostMapping("/category")
    @ResponseBody
    public Result create(@RequestBody Category category) throws AppException {
        categoryService.save(category);
        return new Result<>();
    }

    @PutMapping("/category/{id}")
    @ResponseBody
    public Result update(@RequestBody Category category) throws AppException {
        categoryService.update(category);
        return new Result<>();
    }
}
