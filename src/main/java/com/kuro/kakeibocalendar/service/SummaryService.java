package com.kuro.kakeibocalendar.service;

import java.util.List;

import com.kuro.kakeibocalendar.domain.DailySummary;

public interface SummaryService {

    List<DailySummary> findMonthlySummary(int year, int month);
}