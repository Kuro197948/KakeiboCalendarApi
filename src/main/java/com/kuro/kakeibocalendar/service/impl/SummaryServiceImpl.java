package com.kuro.kakeibocalendar.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.kuro.kakeibocalendar.domain.DailySummary;
import com.kuro.kakeibocalendar.mapper.SummaryMapper;
import com.kuro.kakeibocalendar.service.SummaryService;

@Service
public class SummaryServiceImpl implements SummaryService {

    private final SummaryMapper summaryMapper;

    public SummaryServiceImpl(SummaryMapper summaryMapper) {
        this.summaryMapper = summaryMapper;
    }

    @Override
    public List<DailySummary> findMonthlySummary(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return summaryMapper.findMonthlySummary(startDate, endDate);
    }
}