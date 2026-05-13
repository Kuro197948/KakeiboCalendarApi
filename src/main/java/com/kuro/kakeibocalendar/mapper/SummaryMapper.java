package com.kuro.kakeibocalendar.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kuro.kakeibocalendar.domain.DailySummary;

@Mapper
public interface SummaryMapper {

    List<DailySummary> findMonthlySummary(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}