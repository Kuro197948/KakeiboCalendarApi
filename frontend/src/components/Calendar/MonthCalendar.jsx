import { useEffect, useRef, useState } from "react";
import "./MonthCalendar.css";

function MonthCalendar({ year, month, summaries, activeDate, onDateClick }) {
  const cellRefs = useRef({});
  const [scatterStyles, setScatterStyles] = useState({});

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const summaryMap = new Map(
    summaries.map((summary) => [summary.date, summary])
  );

  const calendarCells = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  useEffect(() => {
    if (!activeDate) {
      setScatterStyles({});
    }
  }, [activeDate]);

  const formatDateKey = (day) => {
    const monthText = String(month).padStart(2, "0");
    const dayText = String(day).padStart(2, "0");
    return `${year}-${monthText}-${dayText}`;
  };

  const registerCellRef = (dateKey, element) => {
    if (element) {
      cellRefs.current[dateKey] = element;
    } else {
      delete cellRefs.current[dateKey];
    }
  };

  const buildScatterStyles = (selectedDateKey, selectedRect) => {
    const selectedCenterX = selectedRect.left + selectedRect.width / 2;
    const selectedCenterY = selectedRect.top + selectedRect.height / 2;

    const nextStyles = {};

    Object.entries(cellRefs.current).forEach(([dateKey, element]) => {
      if (!element || dateKey === selectedDateKey) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const cellCenterX = rect.left + rect.width / 2;
      const cellCenterY = rect.top + rect.height / 2;

      const dx = cellCenterX - selectedCenterX;
      const dy = cellCenterY - selectedCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const directionX = dx / distance;
      const directionY = dy / distance;

      const spreadDistance = 420 + Math.min(distance * 0.6, 160);
      const rotate = directionX * 18 + directionY * 8;

      nextStyles[dateKey] = {
        "--scatter-x": `${directionX * spreadDistance}px`,
        "--scatter-y": `${directionY * spreadDistance}px`,
        "--scatter-rotate": `${rotate}deg`,
      };
    });

    setScatterStyles(nextStyles);
  };

  const handleCellClick = (dateKey, event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    buildScatterStyles(dateKey, rect);
    onDateClick(dateKey, rect);
  };

  return (
    <div className="calendar-wrap">
      <h2 className="calendar-title">
        {year}年{month}月
      </h2>

      <div className="calendar-grid calendar-week-header">
        <div>日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div>土</div>
      </div>

      <div className="calendar-grid">
        {calendarCells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="calendar-cell empty"
              />
            );
          }

          const dateKey = formatDateKey(day);
          const summary = summaryMap.get(dateKey);

          const isFocused = activeDate === dateKey;
          const isScattering = activeDate && activeDate !== dateKey;

          const cellClassName = [
            "calendar-cell",
            isFocused ? "calendar-cell-focused" : "",
            isScattering ? "calendar-cell-scatter" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={dateKey}
              ref={(element) => registerCellRef(dateKey, element)}
              className={cellClassName}
              style={scatterStyles[dateKey]}
              type="button"
              onClick={(event) => handleCellClick(dateKey, event)}
              disabled={Boolean(activeDate)}
            >
              <div className="day-number">{day}</div>

              {summary ? (
                <div className="money-summary">
                  <div className="expense">
                    出 {summary.expenseTotal.toLocaleString()}
                  </div>

                  <div className="income">
                    入 {summary.incomeTotal.toLocaleString()}
                  </div>

                  <div
                    className={
                      summary.balance < 0
                        ? "balance negative"
                        : "balance positive"
                    }
                  >
                    差 {summary.balance.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="no-data">未入力</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MonthCalendar;