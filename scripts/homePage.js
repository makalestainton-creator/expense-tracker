import { calculateTotalExpenditure } from "./expenseSummary.js";
import { changeTheme } from "./utils/changeTheme.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { renderExpenseChart } from "./utils/chart.js";
import { renderRecentExpenses } from "./recents.js";

export const today = dayjs();

const month = today.format("MMMM YYYY");
document.querySelector(".js-month-pill").textContent = `${month}`;
calculateTotalExpenditure();
renderExpenseChart();
changeTheme();
renderRecentExpenses();

function addExpense() {
  const expenseDescription = document.querySelector(
    ".js-expense-description-input",
  ).value;
  const expenseAmount = Number(
    document.querySelector(".js-expense-amount-input").value,
  );
  const expenseCartegory = document.querySelector(
    ".js-expense-cartegory-input",
  ).value;
  const expenseDate = document.querySelector(".js-expense-date-input").value;

  const newExpense = {
    name: expenseDescription,
    cost: expenseAmount,
    cartegory: expenseCartegory,
    date: expenseDate,
  };

  // avoids adding empty expenses

  if (
    !expenseDescription ||
    !expenseCartegory ||
    !expenseDate ||
    !document.querySelector(".js-expense-amount-input").value
  ) {
    document.querySelector(".js-empty-field-warning").textContent = `
      Please fill all the fields!
    `;
    return;
  }

  if (expenseAmount <= 0 || expenseAmount !== Number(expenseAmount)) {
    document.querySelector(".js-empty-field-warning").textContent = `
          Unexpected input!
          `;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      document.querySelector(".js-empty-field-warning").textContent = "";
    }, 2000);
    return;
  }

  // Load fresh from localStorage, add new expense, save back

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(newExpense);

  // console.log("After add:", expenses);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  calculateTotalExpenditure();

  // show added message
  document.querySelector(".js-added-to-tracker").innerHTML =
    "<img src='icons/checkmark.png' class='checkmark' />Added";

  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    document.querySelector(".js-added-to-tracker").innerHTML = "";
  }, 2000);

  document.querySelectorAll(".js-expense-input").forEach((expenseInput) => {
    expenseInput.value = "";
  });
  calculateTotalExpenditure();
  renderExpenseChart();
  renderRecentExpenses();
}

const addButton = document.querySelector(".js-add-expense-button");

let timeoutId;
if (addButton) {
  addButton.addEventListener("click", () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      document.querySelector(".js-empty-field-warning").innerHTML = "";
    }, 4000);
    addExpense();
  });
}

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      document.querySelector(".js-empty-field-warning").innerHTML = "";
    }, 4000);
    addExpense();
  }
});
