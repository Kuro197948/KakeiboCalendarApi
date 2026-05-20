import { useEffect, useState } from "react";
import { fetchCategories } from "./api/categoryApi";
import { fetchMonthlySummary } from "./api/summaryApi";
import {
  createTransaction,
  fetchTransactionsByDate,
  updateTransaction,
} from "./api/transactionApi";
import MonthCalendar from "./components/Calendar/MonthCalendar";
import DayDetailLayer from "./components/DayDetail/DayDetailLayer";
import TransactionFormLayer from "./components/TransactionForm/TransactionFormLayer";
import "./App.css";

function App() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5);

  const [summaries, setSummaries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarTransitionDate, setCalendarTransitionDate] = useState(null);
  const [isCalendarResetting, setIsCalendarResetting] = useState(false);
  const [originRect, setOriginRect] = useState(null);
  const [formOriginRect, setFormOriginRect] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formType, setFormType] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseDateKey = (dateKey) => {
    return new Date(`${dateKey}T00:00:00`);
  };

  const loadMonthlySummary = async (year = currentYear, month = currentMonth) => {
    const data = await fetchMonthlySummary(year, month);
    setSummaries(data);
  };

  const loadTransactionsByDate = async (date) => {
    const data = await fetchTransactionsByDate(date);
    setTransactions(data);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [summaryData, categoryData] = await Promise.all([
          fetchMonthlySummary(currentYear, currentMonth),
          fetchCategories(),
        ]);

        setSummaries(summaryData);
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
        setErrorMessage("初期データの取得に失敗しました。");
      }
    };

    loadInitialData();
  }, []);

  const handleDateClick = async (date, rect) => {
    try {
      setErrorMessage("");
      setCalendarTransitionDate(date);
      setOriginRect(rect);
      setSelectedDate(date);
      setTransactions([]);
      setFormType(null);
      setFormOriginRect(null);
      setEditingTransaction(null);

      const transactionData = await fetchTransactionsByDate(date);
      setTransactions(transactionData);
    } catch (error) {
      console.error(error);
      setCalendarTransitionDate(null);
      setOriginRect(null);
      setSelectedDate(null);
      setErrorMessage("日別明細の取得に失敗しました。");
    }
  };

  const handleMoveSelectedDate = async (dayOffset) => {
    if (!selectedDate) {
      return;
    }

    try {
      setErrorMessage("");
      setFormType(null);
      setFormOriginRect(null);
      setEditingTransaction(null);
      setTransactions([]);

      const baseDate = parseDateKey(selectedDate);
      baseDate.setDate(baseDate.getDate() + dayOffset);

      const nextDateKey = formatDateKey(baseDate);
      const nextYear = baseDate.getFullYear();
      const nextMonth = baseDate.getMonth() + 1;

      setSelectedDate(nextDateKey);
      setCalendarTransitionDate(nextDateKey);

      if (nextYear !== currentYear || nextMonth !== currentMonth) {
        setCurrentYear(nextYear);
        setCurrentMonth(nextMonth);
        await loadMonthlySummary(nextYear, nextMonth);
      }

      await loadTransactionsByDate(nextDateKey);
    } catch (error) {
      console.error(error);
      setErrorMessage("日付の変更に失敗しました。");
    }
  };

  const handleCloseDayLayer = () => {
    setSelectedDate(null);
    setFormOriginRect(null);
    setTransactions([]);
    setFormType(null);
    setEditingTransaction(null);

    setIsCalendarResetting(true);
    setCalendarTransitionDate(null);
    setOriginRect(null);

    window.setTimeout(() => {
      setIsCalendarResetting(false);
    }, 50);
  };

  const handleOpenForm = (type, rect) => {
    setFormType(type);
    setFormOriginRect(rect);
    setEditingTransaction(null);
  };

  const handleOpenEditForm = (transaction, rect) => {
    setFormType(transaction.type);
    setFormOriginRect(rect);
    setEditingTransaction(transaction);
  };

  const handleCloseForm = () => {
    setFormType(null);
    setFormOriginRect(null);
    setEditingTransaction(null);
  };

  const handleBalanceTap = () => {
    alert(
      "差引は入金と出金から自動計算されます。変更する場合は、入金または出金の金額を変更してください。"
    );
  };

  const handleSubmitTransaction = async (transaction) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
      } else {
        await createTransaction(transaction);
      }

      await loadTransactionsByDate(selectedDate);
      await loadMonthlySummary(currentYear, currentMonth);

      setFormType(null);
      setFormOriginRect(null);
      setEditingTransaction(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("登録または更新に失敗しました。");
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">カレンダー家計簿</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <MonthCalendar
        year={currentYear}
        month={currentMonth}
        summaries={summaries}
        activeDate={calendarTransitionDate}
        isResetting={isCalendarResetting}
        onDateClick={handleDateClick}
      />

      {selectedDate && (
        <DayDetailLayer
          selectedDate={selectedDate}
          transactions={transactions}
          originRect={originRect}
          onClose={handleCloseDayLayer}
          onPrevDate={() => handleMoveSelectedDate(-1)}
          onNextDate={() => handleMoveSelectedDate(1)}
          onDateTitleClick={handleCloseDayLayer}
          onAddExpense={(rect) => handleOpenForm("EXPENSE", rect)}
          onAddIncome={(rect) => handleOpenForm("INCOME", rect)}
          onEditTransaction={handleOpenEditForm}
          onBalanceTap={handleBalanceTap}
        />
      )}

      {selectedDate && formType && (
        <TransactionFormLayer
          selectedDate={selectedDate}
          type={formType}
          categories={categories}
          originRect={formOriginRect}
          editingTransaction={editingTransaction}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
}

export default App;