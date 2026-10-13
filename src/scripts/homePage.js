import "../fonts/stylesheet.css";
import "../styles/shared.css";
import "../styles/home-page.css";
import "../styles/expenses.css";
import checkMark from "../icons/checkmark.png";

import { displayExpenses, updateExpenseNum } from "./expenses.js";
import { calculateTotalExpenditure } from "./expenseSummary.js";
import { changeTheme } from "./utils/changeTheme.js";
import dayjs from "dayjs";
import { renderExpenseChart } from "./utils/chart.js";
import { renderRecentExpenses } from "./recents.js";

import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const searchContainer = document.querySelector(".search");
const searchInput = searchContainer.querySelector("input");
const chartContainer = document.querySelector(".js-chart-container");

const categorySelect = new TomSelect("#category-select", {
  create: false,
  controlInput: null,
  onDropdownOpen: function() {
    // Optional: dynamically adjusts position attributes if required by container wrappers
    this.dropdown.style.marginTop = "4px"; 
  }
});


const datePicker = flatpickr(".js-expense-date-input", {
  dateFormat: "Y-m-d",
  defaultDate: "today",
  altInput: true,
  altFormat: "F j, Y", // Beautifies user layout display text
});

let resizeTimeout;
const resizeObserver = new ResizeObserver(() => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderExpenseChart();
  }, 100);
});

resizeObserver.observe(chartContainer);

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
  document
    .querySelector(".js-expense-screen")
    .classList.add("expense-screen-active");
  document
    .querySelector(".js-home-screen")
    .classList.add("home-screen-inactive");
  searchContainer.style.display = "block";
  searchInput.focus();
}

document.querySelector(".home-btn").addEventListener("click", (e) => {
  toggleActiveMode(e.target);
  document
    .querySelector(".js-expense-screen")
    .classList.remove("expense-screen-active");
  document
    .querySelector(".js-home-screen")
    .classList.remove("home-screen-inactive");
  searchContainer.style.display = "";
  localStorage.setItem("homescreen", "active");
});

document.querySelector(".expenses-btn").addEventListener("click", (e) => {
  toggleActiveMode(e.target);
  document
    .querySelector(".js-expense-screen")
    .classList.add("expense-screen-active");
  document
    .querySelector(".js-home-screen")
    .classList.add("home-screen-inactive");
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
  const expenseCategory = categorySelect.getValue();
  const expenseDate = datePicker.input.value;

  document.querySelectorAll(".error").forEach((elm) => {
    elm.classList.remove("visible");
  });

  let hasError = false;

  if (!expenseDescription) {
    document.querySelector(".description-error").classList.add("visible");
    hasError = true;
  }

  if (expenseAmount <= 0 || expenseAmount !== Number(expenseAmount)) {
    document.querySelector(".amount-error").classList.add("visible");
    hasError = true;
  }

  if (!expenseDate) {
    document.querySelector(".date-error").classList.add("visible");
    hasError = true;
  }

  if (hasError) return;

  const newExpense = {
    name: expenseDescription,
    cost: expenseAmount,
    category: expenseCategory,
    date: expenseDate,
    time: dayjs().format("HH:mm"),
    edited: false,
  };

  // Load fresh from localStorage, add new expense, save back

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(newExpense);

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

  categorySelect.setValue("Food");
  datePicker.setDate(new Date());

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
    addExpense();
  });
}

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addExpense();
  }
});
