package com.kuro.kakeibocalendar.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.kakeibocalendar.domain.DailySummary;
import com.kuro.kakeibocalendar.service.SummaryService;

@RestController
@RequestMapping("/api/summaries")
public class SummaryApiController {

    private final SummaryService summaryService;

    public SummaryApiController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping("/month")
    public List<DailySummary> findMonthlySummary(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        return summaryService.findMonthlySummary(year, month);
    }
}