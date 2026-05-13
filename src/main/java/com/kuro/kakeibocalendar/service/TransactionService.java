package com.kuro.kakeibocalendar.service;

import java.time.LocalDate;
import java.util.List;

import com.kuro.kakeibocalendar.domain.Transaction;
import com.kuro.kakeibocalendar.dto.TransactionRequest;

public interface TransactionService {

    Transaction create(TransactionRequest request);

    List<Transaction> findByDate(LocalDate transactionDate);
}