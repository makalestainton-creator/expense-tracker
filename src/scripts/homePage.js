import "../styles/shared.css";
import "../styles/home-page.css";
import "../styles/expenses.css";
import checkMark from "../icons/checkmark.png";


import { displayExpenses, updateExpenseNum } from "./expenses.js"
import { calculateTotalExpenditure } from "./expenseSummary.js";
import { changeTheme } from "./utils/changeTheme.js";
import dayjs from "dayjs";
import { renderExpenseChart } from "./utils/chart.js";
import { renderRecentExpenses } from "./recents.js";

const searchContainer = document.querySelector(".search");
const searchInput = searchContainer.querySelector("input");
const chartContainer = document.querySelector(".js-chart-container");

// let resizeTimeout;
// const resizeObserver = new ResizeObserver(() => {
//   clearTimeout(resizeTimeout);
//   resizeTimeout = setTimeout(() => {
//     renderExpenseChart();
//   }, 100);
// });

// resizeObserver.observe(chartContainer);


const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

calculateTotalExpenditure();
renderExpenseChart();
changeTheme();
renderRecentExpenses();


function toggleActiveMode(button) {
  document.querySelectorAll(".mode").forEach((btn) => {
    btn.classList.remove("active-mode");
  });

  button.classList.add("active-mode");
}

if (localStorage.getItem("homescreen") === "inactive") {
  toggleActiveMode(document.querySelector(".expenses-btn"));
  document.querySelector(".js-expense-screen").classList.add("expense-screen-active");
  document.querySelector(".js-home-screen").classList.add("home-screen-inactive");
  searchContainer.style.display = "block";
  searchInput.focus();
}

document.querySelector(".home-btn").addEventListener("click", (e) => {
  toggleActiveMode(e.target);
  document.querySelector(".js-expense-screen").classList.remove("expense-screen-active");
  document.querySelector(".js-home-screen").classList.remove("home-screen-inactive");
  searchContainer.style.display = "";
  localStorage.setItem("homescreen", "active");
});

document.querySelector(".expenses-btn").addEventListener("click", (e) => {
  toggleActiveMode(e.target);
  document.querySelector(".js-expense-screen").classList.add("expense-screen-active");
  document.querySelector(".js-home-screen").classList.add("home-screen-inactive");
  searchContainer.style.display = "block";
  searchInput.focus();
  localStorage.setItem("homescreen", "inactive");
});

const currentMonth = dayjs().format("MMMM");
document.querySelector(".js-month-pill").textContent = `${currentMonth}`;

function addExpense() {
  const expenseDescription = document.querySelector(
    ".js-expense-description-input",
  ).value;
  const expenseAmount = Number(
    document.querySelector(".js-expense-amount-input").value,
  );
  const expenseCategory = document.querySelector(
    ".js-expense-category-input",
  ).value;
  const expenseDate = document.querySelector(".js-expense-date-input").value;

  const newExpense = {
    name: expenseDescription,
    cost: expenseAmount,
    category: expenseCategory,
    date: expenseDate,
  };

  // avoids adding empty expenses

  if (
    !expenseDescription ||
    !expenseCategory ||
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
    `<img src="${checkMark}" class="checkmark" />Added`;

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
  displayExpenses(expenses);
  updateExpenseNum(expenses);
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
