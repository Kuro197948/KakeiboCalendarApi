package com.kuro.kakeibocalendar.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.kakeibocalendar.domain.Transaction;
import com.kuro.kakeibocalendar.dto.TransactionRequest;
import com.kuro.kakeibocalendar.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionApiController {

    private final TransactionService transactionService;

    public TransactionApiController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Transaction create(@RequestBody TransactionRequest request) {
        return transactionService.create(request);
    }

    @GetMapping
    public List<Transaction> findByDate(
            @RequestParam("date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return transactionService.findByDate(date);
    }
}