import "./DayDetailLayer.css";

function DayDetailLayer({
  selectedDate,
  transactions,
  onClose,
  onAddExpense,
  onAddIncome,
}) {
  const expenseTotal = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const incomeTotal = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = incomeTotal - expenseTotal;

  return (
    <div className="day-layer-backdrop">
      <div className="day-layer-card">
        <button className="day-layer-close" type="button" onClick={onClose}>
          ×
        </button>

        <h2 className="day-layer-title">{selectedDate}</h2>

        <div className="day-summary-box">
          <div>
            <span>出金</span>
            <strong className="expense">{expenseTotal.toLocaleString()}円</strong>
          </div>
          <div>
            <span>入金</span>
            <strong className="income">{incomeTotal.toLocaleString()}円</strong>
          </div>
          <div>
            <span>差引</span>
            <strong className={balance < 0 ? "expense" : "income"}>
              {balance.toLocaleString()}円
            </strong>
          </div>
        </div>

        <div className="transaction-list">
          <h3>明細</h3>

          {transactions.length === 0 ? (
            <p className="empty-message">この日の記録はまだありません。</p>
          ) : (
            transactions.map((item) => (
              <div className="transaction-item" key={item.id}>
                <div>
                  <strong>{item.categoryName}</strong>
                  <p>{item.memo || "メモなし"}</p>
                </div>

                <span className={item.type === "EXPENSE" ? "expense" : "income"}>
                  {item.type === "EXPENSE" ? "-" : "+"}
                  {item.amount.toLocaleString()}円
                </span>
              </div>
            ))
          )}
        </div>

        <div className="day-action-area">
          <button type="button" className="expense-button" onClick={onAddExpense}>
            出金を追加
          </button>
          <button type="button" className="income-button" onClick={onAddIncome}>
            入金を追加
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayDetailLayer;