import { useEffect, useState } from "react";
import { fetchCategories } from "./api/categoryApi";
import { fetchMonthlySummary } from "./api/summaryApi";
import {
  createTransaction,
  fetchTransactionsByDate,
} from "./api/transactionApi";
import MonthCalendar from "./components/Calendar/MonthCalendar";
import DayDetailLayer from "./components/DayDetail/DayDetailLayer";
import TransactionFormLayer from "./components/TransactionForm/TransactionFormLayer";
import "./App.css";

function App() {
  const [summaries, setSummaries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarTransitionDate, setCalendarTransitionDate] = useState(null);
  const [isCalendarResetting, setIsCalendarResetting] = useState(false);
  const [originRect, setOriginRect] = useState(null);
  const [formOriginRect, setFormOriginRect] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formType, setFormType] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const year = 2026;
  const month = 5;

  const loadMonthlySummary = async () => {
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
          fetchMonthlySummary(year, month),
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

  const handleCloseDayLayer = () => {
    setSelectedDate(null);
    setFormOriginRect(null);
    setTransactions([]);
    setFormType(null);

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
  };

  const handleCloseForm = () => {
    setFormType(null);
    setFormOriginRect(null);
  };

  const handleSubmitTransaction = async (transaction) => {
    try {
      await createTransaction(transaction);

      await loadTransactionsByDate(selectedDate);
      await loadMonthlySummary();

      setFormType(null);
      setFormOriginRect(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("登録に失敗しました。");
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">カレンダー家計簿</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <MonthCalendar
        year={year}
        month={month}
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
          onAddExpense={(rect) => handleOpenForm("EXPENSE", rect)}
          onAddIncome={(rect) => handleOpenForm("INCOME", rect)}
        />
      )}

      {selectedDate && formType && (
        <TransactionFormLayer
          selectedDate={selectedDate}
          type={formType}
          categories={categories}
          originRect={formOriginRect}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
}

export default App;