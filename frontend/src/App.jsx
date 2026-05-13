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

  const handleDateClick = async (date) => {
    try {
      await loadTransactionsByDate(date);
      setSelectedDate(date);
    } catch (error) {
      console.error(error);
      setErrorMessage("日別明細の取得に失敗しました。");
    }
  };

  const handleCloseDayLayer = () => {
    setSelectedDate(null);
    setTransactions([]);
    setFormType(null);
  };

  const handleOpenForm = (type) => {
    setFormType(type);
  };

  const handleCloseForm = () => {
    setFormType(null);
  };

  const handleSubmitTransaction = async (transaction) => {
    try {
      await createTransaction(transaction);

      await loadTransactionsByDate(selectedDate);
      await loadMonthlySummary();

      setFormType(null);
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
        onDateClick={handleDateClick}
      />

      {selectedDate && (
        <DayDetailLayer
          selectedDate={selectedDate}
          transactions={transactions}
          onClose={handleCloseDayLayer}
          onAddExpense={() => handleOpenForm("EXPENSE")}
          onAddIncome={() => handleOpenForm("INCOME")}
        />
      )}

      {selectedDate && formType && (
        <TransactionFormLayer
          selectedDate={selectedDate}
          type={formType}
          categories={categories}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
}

export default App;