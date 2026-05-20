import { useEffect, useRef, useState } from "react";
import "./TransactionFormLayer.css";

const CLOSE_DISTANCE = 120;

function TransactionFormLayer({
  selectedDate,
  type,
  categories,
  originRect,
  editingTransaction,
  onClose,
  onSubmit,
}) {
  const startPointRef = useRef({ x: 0, y: 0 });

  const [dragState, setDragState] = useState({
    isDragging: false,
    isClosing: false,
    x: 0,
    y: 0,
  });

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [memo, setMemo] = useState("");

  const actualType = editingTransaction ? editingTransaction.type : type;

  const filteredCategories = categories.filter(
    (category) => category.type === actualType
  );

  useEffect(() => {
    if (editingTransaction) {
      setAmount(String(editingTransaction.amount));
      setCategoryId(String(editingTransaction.categoryId));
      setMemo(editingTransaction.memo || "");
      return;
    }

    setAmount("");
    setMemo("");

    if (filteredCategories.length > 0) {
      setCategoryId(String(filteredCategories[0].id));
    }
  }, [editingTransaction, actualType, categories]);

  const typeLabel = actualType === "EXPENSE" ? "出金" : "入金";
  const modeLabel = editingTransaction ? "変更" : "追加";

  const handlePointerDown = (event) => {
    if (event.target.closest("input, select, textarea, button")) {
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
    const maxCardWidth = 390;
    const cardWidth = Math.min(maxCardWidth, window.innerWidth - margin * 2);

    if (!originRect) {
      return {
        left: "50%",
        top: "50%",
        width: `${cardWidth}px`,
        transform: `translate(-50%, -50%) translate(${dragState.x}px, ${
          dragState.y
        }px) rotate(${dragState.x / 30}deg)`,
        opacity: dragState.isClosing ? 0 : 1,
      };
    }

    const centerX = originRect.left + originRect.width / 2;

    const baseLeft = Math.min(
      Math.max(centerX - cardWidth / 2, margin),
      window.innerWidth - cardWidth - margin
    );

    const baseTop = Math.max(originRect.top - 260, margin);

    return {
      left: `${baseLeft}px`,
      top: `${baseTop}px`,
      width: `${cardWidth}px`,
      transform: `translate(${dragState.x}px, ${dragState.y}px) rotate(${
        dragState.x / 30
      }deg)`,
      opacity: dragState.isClosing ? 0 : 1,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("金額を入力してください。");
      return;
    }

    if (!categoryId) {
      alert("科目を選択してください。");
      return;
    }

    onSubmit({
      transactionDate: selectedDate,
      type: actualType,
      amount: Number(amount),
      categoryId: Number(categoryId),
      memo,
    });
  };

  const cardStyle = getAnchorStyle();

  return (
    <div className="form-layer-backdrop">
      <div
        className={
          dragState.isDragging
            ? "form-layer-card dragging"
            : "form-layer-card"
        }
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <button className="form-layer-close" type="button" onClick={onClose}>
          ×
        </button>

        <h2 className="form-layer-title">
          {selectedDate} の{typeLabel}を{modeLabel}
        </h2>

        <form onSubmit={handleSubmit} className="transaction-form">
          <label>
            金額
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="例：980"
            />
          </label>

          <label>
            科目
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            メモ
            <input
              type="text"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="例：昼食"
            />
          </label>

          <button
            className={
              actualType === "EXPENSE" ? "submit-expense" : "submit-income"
            }
            type="submit"
          >
            {editingTransaction ? "変更を保存" : "保存する"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionFormLayer;