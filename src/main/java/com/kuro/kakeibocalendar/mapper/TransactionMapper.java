package com.kuro.kakeibocalendar.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kuro.kakeibocalendar.domain.Transaction;

@Mapper
public interface TransactionMapper {

    void insert(Transaction transaction);

    Transaction findById(Long id);

    List<Transaction> findByDate(LocalDate transactionDate);
}