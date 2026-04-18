import { today } from "./homePage.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function renderCategorySVG(expense) {
  if (expense.category === "Food") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="#3bb184" stroke="#3bb184" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 3v10"/>
          <path d="M10 3v10"/>
          <path d="M6 7h4"/>
          <path d="M14 3v18"/>
        </svg>`;
  } else if (expense.category === "Transport") {
    return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#60A5FA"
          stroke="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="11" width="18" height="5" rx="2" />
          <path d="M5 11l2-4h10l2 4" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>`;
  } else if (expense.category === "Entertainment") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#9049ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V8z"/>
          <path d="M12 8v8"/>
        </svg>`;
  } else if (expense.category === "Shopping") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#beb41d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 7h12l-1 13H7L6 7z"/>
          <path d="M9 7a3 3 0 0 1 6 0"/>
        </svg>`;
  } else if (expense.category === "Bills") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#1d578a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z"/>
          <path d="M9 7h6"/>
          <path d="M9 11h6"/>
        </svg>`;
  } else if (expense.category === "Health") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#3c7ec0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
        </svg>`;
  } else if (expense.category === "Other") {
    return `
        <svg width="24" height="24" viewBox="0 0 24 24" 
            fill="none" stroke="#a55133" stroke-width="2" 
            stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>`;
  }
}

export function renderRecentExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const container = document.querySelector(".js-recents-container");
  const dateNum = today.format("DD");
  if (!container) return;
  if (expenses.length === 0) {
    container.textContent = "Recent Expenses will appear here";
    return;
  }

  let recentExpenses = [];

  expenses.forEach((expense) => {
    const expenseDateNum = expense.date.slice(-2);
    if (expenseDateNum === dateNum || dateNum - expenseDateNum < 10) {
      recentExpenses.push(expense);
    }
  });

  container.innerHTML = "<h4>Recent expenses</h4>";

  recentExpenses.forEach((expense) => {
    
    const expenseDateString = dayjs(expense.date).format("dddd MMMM, YYYY");
    const expenseDateNum = expense.date.slice(-2);
    container.innerHTML += `
        <div class="recent-expense">
          <p class="date">${expenseDateString}</p>
          <div class="recent-expense-details">
            <div class="right-side">
              ${renderCategorySVG(expense)}
              <span class="date-no">${expenseDateNum}</span>
              <div class="recent-category">
                ${renderCategorySVG(expense)}
                <p class="category-name">${expense.category}</p>
              </div>
              <p class="recent-expense-description">${expense.name}</p>
            </div>
            <p class="recent-expense-cost">Ksh.${expense.cost}</p>
          </div>
        </div>
      `;

    const recentCategory = document.querySelectorAll(".recent-category");

    recentCategory.forEach((element) => {
      if (
        expense.category === "Food" &&
        element.querySelector(".category-name").textContent === "Food"
      ) {
        element.classList.add("recent-food-category");
      } else if (
        expense.category === "Transport" &&
        element.querySelector(".category-name").textContent === "Transport"
      ) {
        element.classList.add("recent-transport-category");
      } else if (
        expense.category === "Entertainment" &&
        element.querySelector(".category-name").textContent === "Entertainment"
      ) {
        element.classList.add("recent-entertainment-category");
      } else if (
        expense.category === "Shopping" &&
        element.querySelector(".category-name").textContent === "Shopping"
      ) {
        element.classList.add("recent-shopping-category");
      } else if (
        expense.category === "Bills" &&
        element.querySelector(".category-name").textContent === "Bills"
      ) {
        element.classList.add("recent-bills-category");
      } else if (
        expense.category === "Health" &&
        element.querySelector(".category-name").textContent === "Health"
      ) {
        element.classList.add("recent-health-category");
      } else if (
        expense.category === "Other" &&
        element.querySelector(".category-name").textContent === "Other"
      ) {
        element.classList.add("recent-other-category");
      }
    });
  });
}
