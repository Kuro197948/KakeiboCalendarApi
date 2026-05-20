import { useRef, useState } from "react";
import "./DayDetailLayer.css";

const CLOSE_DISTANCE = 120;
const FIXED_TOP = 24;

function DayDetailLayer({
  selectedDate,
  transactions,
  originRect,
  onClose,
  onPrevDate,
  onNextDate,
  onDateTitleClick,
  onAddExpense,
  onAddIncome,
  onEditTransaction,
  onBalanceTap,
}) {
  const startPointRef = useRef({ x: 0, y: 0 });

  const [dragState, setDragState] = useState({
    isDragging: false,
    isClosing: false,
    x: 0,
    y: 0,
  });

  const expenseTransactions = transactions.filter(
    (item) => item.type === "EXPENSE"
  );

  const incomeTransactions = transactions.filter(
    (item) => item.type === "INCOME"
  );

  const expenseTotal = expenseTransactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const incomeTotal = incomeTransactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const balance = incomeTotal - expenseTotal;

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    startPointRef.current = {
      x: event.clientX - dragState.x,
      y: event.clientY - dragState.y,
    };

    setDragState((prev) => ({
      ...prev,
      isDragging: true,
    }));
  };

  const handlePointerMove = (event) => {
    if (!dragState.isDragging || dragState.isClosing) {
      return;
    }

    const nextX = event.clientX - startPointRef.current.x;
    const nextY = event.clientY - startPointRef.current.y;

    setDragState((prev) => ({
      ...prev,
      x: nextX,
      y: nextY,
    }));
  };

  const handlePointerUp = () => {
    if (!dragState.isDragging || dragState.isClosing) {
      return;
    }

    const distance = Math.sqrt(
      dragState.x * dragState.x + dragState.y * dragState.y
    );

    if (distance >= CLOSE_DISTANCE) {
      setDragState((prev) => ({
        ...prev,
        isDragging: false,
        isClosing: true,
        x: prev.x * 2.4,
        y: prev.y * 2.4,
      }));

      setTimeout(() => {
        onClose();
      }, 180);

      return;
    }

    setDragState({
      isDragging: false,
      isClosing: false,
      x: 0,
      y: 0,
    });
  };

  const handleSummaryTap = (type, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const targetTransactions =
      type === "EXPENSE" ? expenseTransactions : incomeTransactions;

    if (targetTransactions.length === 1) {
      onEditTransaction(targetTransactions[0], rect);
      return;
    }

    if (type === "EXPENSE") {
      onAddExpense(rect);
      return;
    }

    onAddIncome(rect);
  };

  const getAnchorStyle = () => {
    const margin = 16;
    const maxCardWidth = 420;
    const cardWidth = Math.min(maxCardWidth, window.innerWidth - margin * 2);

    const baseLeft = Math.max((window.innerWidth - cardWidth) / 2, margin);

    const originCenterX = originRect
      ? originRect.left + originRect.width / 2
      : window.innerWidth / 2;

    const originCenterY = originRect
      ? originRect.top + originRect.height / 2
      : FIXED_TOP + 40;

    const originX = originCenterX - baseLeft;
    const originY = originCenterY - FIXED_TOP;

    return {
      left: `${baseLeft}px`,
      top: `${FIXED_TOP}px`,
      width: `${cardWidth}px`,
      "--open-origin-x": `${originX}px`,
      "--open-origin-y": `${originY}px`,
      transform: `translate(${dragState.x}px, ${dragState.y}px) rotate(${
        dragState.x / 28
      }deg)`,
      opacity: dragState.isClosing ? 0 : 1,
    };
  };

  const cardStyle = getAnchorStyle();

  return (
    <div className="day-layer-backdrop">
      <div
        className={
          dragState.isDragging
            ? "day-layer-card dragging"
            : "day-layer-card"
        }
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="day-layer-content">
          <button className="day-layer-close" type="button" onClick={onClose}>
            ×
          </button>

          <div className="day-date-nav">
            <button
              type="button"
              className="day-date-arrow"
              onClick={onPrevDate}
              aria-label="前の日へ"
            >
              ‹
            </button>

            <button
              type="button"
              className="day-title-button"
              onClick={onDateTitleClick}
              aria-label="カレンダーに戻る"
            >
              {selectedDate}
            </button>

            <button
              type="button"
              className="day-date-arrow"
              onClick={onNextDate}
              aria-label="次の日へ"
            >
              ›
            </button>
          </div>

          <div className="day-summary-box">
            <button
              type="button"
              className="summary-card summary-action"
              onClick={(event) => handleSummaryTap("EXPENSE", event)}
            >
              <span>出金</span>
              <strong className="expense">
                {expenseTotal.toLocaleString()}円
              </strong>
              <small>タップして変更</small>
            </button>

            <button
              type="button"
              className="summary-card summary-action"
              onClick={(event) => handleSummaryTap("INCOME", event)}
            >
              <span>入金</span>
              <strong className="income">
                {incomeTotal.toLocaleString()}円
              </strong>
              <small>タップして変更</small>
            </button>

            <button
              type="button"
              className="summary-card summary-action"
              onClick={onBalanceTap}
            >
              <span>差引</span>
              <strong className={balance < 0 ? "expense" : "income"}>
                {balance.toLocaleString()}円
              </strong>
              <small>自動計算</small>
            </button>
          </div>

          <div className="transaction-list">
            <h3>明細</h3>

            {transactions.length === 0 ? (
              <p className="empty-message">この日の記録はまだありません。</p>
            ) : (
              transactions.map((item) => (
                <button
                  className="transaction-item"
                  type="button"
                  key={item.id}
                  onClick={(event) =>
                    onEditTransaction(
                      item,
                      event.currentTarget.getBoundingClientRect()
                    )
                  }
                >
                  <div>
                    <strong>{item.categoryName}</strong>
                    <p>{item.memo || "メモなし"}</p>
                  </div>

                  <span
                    className={item.type === "EXPENSE" ? "expense" : "income"}
                  >
                    {item.type === "EXPENSE" ? "-" : "+"}
                    {item.amount.toLocaleString()}円
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="day-action-area">
            <button
              type="button"
              className="expense-button"
              onClick={(event) =>
                onAddExpense(event.currentTarget.getBoundingClientRect())
              }
            >
              出金を追加
            </button>

            <button
              type="button"
              className="income-button"
              onClick={(event) =>
                onAddIncome(event.currentTarget.getBoundingClientRect())
              }
            >
              入金を追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayDetailLayer;