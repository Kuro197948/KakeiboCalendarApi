package com.kuro.kakeibocalendar.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kuro.kakeibocalendar.domain.Category;
import com.kuro.kakeibocalendar.mapper.CategoryMapper;
import com.kuro.kakeibocalendar.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<Category> findAll() {
        return categoryMapper.findAll();
    }
}