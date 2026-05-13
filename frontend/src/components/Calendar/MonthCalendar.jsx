import "./MonthCalendar.css";

function MonthCalendar({
  year,
  month,
  summaries,
  activeDate,
  isResetting,
  onDateClick,
}) {
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

  const formatDateKey = (day) => {
    const monthText = String(month).padStart(2, "0");
    const dayText = String(day).padStart(2, "0");
    return `${year}-${monthText}-${dayText}`;
  };

  const handleCellClick = (dateKey, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onDateClick(dateKey, rect);
  };

  const calendarClassName = [
    "calendar-wrap",
    activeDate ? "calendar-entering" : "",
    isResetting ? "no-transition" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={calendarClassName}>
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

      <div className="calendar-grid calendar-body">
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

          const cellClassName = [
            "calendar-cell",
            isFocused ? "calendar-cell-focused" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={dateKey}
              className={cellClassName}
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