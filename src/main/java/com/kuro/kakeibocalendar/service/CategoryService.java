package com.kuro.kakeibocalendar.service;

import java.util.List;

import com.kuro.kakeibocalendar.domain.Category;

public interface CategoryService {

    List<Category> findAll();
}