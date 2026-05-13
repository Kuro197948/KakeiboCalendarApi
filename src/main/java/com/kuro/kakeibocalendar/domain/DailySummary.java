package com.kuro.kakeibocalendar.domain;

import java.time.LocalDate;

public class DailySummary {

    private LocalDate date;
    private Integer incomeTotal;
    private Integer expenseTotal;
    private Integer balance;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getIncomeTotal() {
        return incomeTotal;
    }

    public void setIncomeTotal(Integer incomeTotal) {
        this.incomeTotal = incomeTotal;
    }

    public Integer getExpenseTotal() {
        return expenseTotal;
    }

    public void setExpenseTotal(Integer expenseTotal) {
        this.expenseTotal = expenseTotal;
    }

    public Integer getBalance() {
        return balance;
    }

    public void setBalance(Integer balance) {
        this.balance = balance;
    }
}