import dayjs from "dayjs";

function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses")) || [];
}

function getDailyTotal(expenses = getExpenses()) {
  const today = dayjs().format("YYYY-MM-DD");
  return expenses.reduce((total, expense) => {
    return expense.date === today ? total + Number(expense.cost) : total;
  }, 0);
}

function getMonthlyTotal(expenses = getExpenses()) {
  return expenses.reduce((total, expense) => {
    return dayjs(expense.date).isSame(dayjs(), "month")
      ? total + Number(expense.cost)
      : total;
  }, 0);
}

export function renderTotalExpenditure() {
  const expenses = getExpenses();

  document.querySelector(".today").textContent = `${dayjs().format("D dddd, MMMM YYYY")}`;
  document.querySelector(".todays-total").textContent = `${getDailyTotal(expenses)}`;
  document.querySelector(".current-month").textContent = `${dayjs().format("MMMM")}`;
  document.querySelector(".current-month-total").textContent =
    `${getMonthlyTotal(expenses)}`;
}
