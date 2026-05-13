package com.kuro.kakeibocalendar.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kuro.kakeibocalendar.domain.Category;

@Mapper
public interface CategoryMapper {

    List<Category> findAll();
}