import { useEffect, useState } from "react";
import "./TransactionFormLayer.css";

function TransactionFormLayer({
  selectedDate,
  type,
  categories,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [memo, setMemo] = useState("");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(String(filteredCategories[0].id));
    }
  }, [type, categories]);

  const typeLabel = type === "EXPENSE" ? "出金" : "入金";

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
      type,
      amount: Number(amount),
      categoryId: Number(categoryId),
      memo,
    });
  };

  return (
    <div className="form-layer-backdrop">
      <div className="form-layer-card">
        <button className="form-layer-close" type="button" onClick={onClose}>
          ×
        </button>

        <h2 className="form-layer-title">
          {selectedDate} の{typeLabel}を追加
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
            className={type === "EXPENSE" ? "submit-expense" : "submit-income"}
            type="submit"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionFormLayer;