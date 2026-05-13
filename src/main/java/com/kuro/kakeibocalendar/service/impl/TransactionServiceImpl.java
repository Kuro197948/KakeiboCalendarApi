package com.kuro.kakeibocalendar.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.kuro.kakeibocalendar.domain.Transaction;
import com.kuro.kakeibocalendar.dto.TransactionRequest;
import com.kuro.kakeibocalendar.mapper.TransactionMapper;
import com.kuro.kakeibocalendar.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionMapper transactionMapper;

    public TransactionServiceImpl(TransactionMapper transactionMapper) {
        this.transactionMapper = transactionMapper;
    }

    @Override
    public Transaction create(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategoryId(request.getCategoryId());
        transaction.setMemo(request.getMemo());

        transactionMapper.insert(transaction);

        return transactionMapper.findById(transaction.getId());
    }

    @Override
    public List<Transaction> findByDate(LocalDate transactionDate) {
        return transactionMapper.findByDate(transactionDate);
    }
}