import { useRef, useState } from "react";
import "./DayDetailLayer.css";

const CLOSE_DISTANCE = 120;

function DayDetailLayer({
  selectedDate,
  transactions,
  originRect,
  onClose,
  onAddExpense,
  onAddIncome,
}) {
  const startPointRef = useRef({ x: 0, y: 0 });

  const [dragState, setDragState] = useState({
    isDragging: false,
    isClosing: false,
    x: 0,
    y: 0,
  });

  const expenseTotal = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const incomeTotal = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

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

  const getAnchorStyle = () => {
    const margin = 16;
    const maxCardWidth = 420;
    const cardWidth = Math.min(maxCardWidth, window.innerWidth - margin * 2);

    if (!originRect) {
      return {
        left: "50%",
        top: "50%",
        width: `${cardWidth}px`,
        transform: `translate(-50%, -50%) translate(${dragState.x}px, ${
          dragState.y
        }px) rotate(${dragState.x / 28}deg)`,
        opacity: dragState.isClosing ? 0 : 1,
      };
    }

    const centerX = originRect.left + originRect.width / 2;

    const baseLeft = Math.min(
      Math.max(centerX - cardWidth / 2, margin),
      window.innerWidth - cardWidth - margin
    );

    const baseTop = Math.max(originRect.top - 280, margin);

    return {
      left: `${baseLeft}px`,
      top: `${baseTop}px`,
      width: `${cardWidth}px`,
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
        <button className="day-layer-close" type="button" onClick={onClose}>
          ×
        </button>

        <h2 className="day-layer-title">{selectedDate}</h2>

        <div className="day-summary-box">
          <div>
            <span>出金</span>
            <strong className="expense">
              {expenseTotal.toLocaleString()}円
            </strong>
          </div>

          <div>
            <span>入金</span>
            <strong className="income">
              {incomeTotal.toLocaleString()}円
            </strong>
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

                <span
                  className={item.type === "EXPENSE" ? "expense" : "income"}
                >
                  {item.type === "EXPENSE" ? "-" : "+"}
                  {item.amount.toLocaleString()}円
                </span>
              </div>
            ))
          )}
        </div>

        <div className="day-action-area">
          <button
            type="button"
            className="expense-button"
            onClick={onAddExpense}
          >
            出金を追加
          </button>

          <button
            type="button"
            className="income-button"
            onClick={onAddIncome}
          >
            入金を追加
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayDetailLayer;