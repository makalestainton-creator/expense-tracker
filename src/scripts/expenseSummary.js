import dayjs from "dayjs";

export function calculateTotalExpenditure() {
  // get todays date using dayjs and display it in a readable format
  const today = dayjs();

  const dateString = today.format("D dddd, MMMM YYYY");

  const month = today.format("MMMM");

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  let dailyTotal = 0;

  let monthlyTotal = 0;

  // accumulate the daily total every time we loop through the expenses
  expenses.forEach((expense) => {
    const cost = expense.cost;

    const dateString = today.format("YYYY-MM-DD");

    const expenseDate = expense.date;

    if (expenseDate === dateString) {
      dailyTotal += cost;
    }

    // accumulate the monthly totals every time we loop through the expenses
    const month = expense.date.slice(5, 7);

    const monthString = today.format("MM");

    if (month === monthString) {
      monthlyTotal += cost;
    }
  });

  document.querySelector(".today").textContent = `${dateString}`;
  document.querySelector(".todays-total").textContent = `${dailyTotal}`;
  document.querySelector(".current-month").textContent = `${month}`;
  document.querySelector(".current-month-total").textContent = `${monthlyTotal}`;
}
