import { renderExpenseChart } from "./utils/chart.js";
import { renderRecentExpenses } from "./recents.js";
import { calculateTotalExpenditure } from "./expenseSummary.js";
import { renderConfirmationDialogue, openFilterMenu } from "./dialogues.js";
import { closeDialogue, renderEditDialogue } from "./dialogues.js";
import { changeTheme } from "./utils/changeTheme.js";

const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const expensesGrid = document
  .querySelector(".js-entries-grid");
const quantityIndicator = document
  .querySelector(".js-expense-quantity");
const clearAllButton = document
  .querySelector(".js-clear-all-button");
const overlay = document
  .querySelector(".js-overlay");
const foodFilter = document
  .getElementById("food-filter");
const transportFilter = document
  .getElementById("transport-filter");
const entertainMentFilter = document
  .getElementById("entertainment-filter");
const shoppingFilter = document
  .getElementById("shopping-filter");
const billsFilter = document
  .getElementById("bills-filter");
const healthFilter = document
  .getElementById("health-filter");
const otherFilter = document
  .getElementById("other-filter");

updateExpenseNum(expenses);
openFilterMenu();

export function displayExpenses(expenses) {
  expensesGrid.innerHTML = "";

  // Always read from localStorage to get true indices for delete/edit
  const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

  expenses.forEach((expense) => {
    // Find the real index in the full array so delete/edit always hit the right item
    const realIndex = allExpenses.findIndex(
      (e) =>
        e.name === expense.name &&
        e.cost === expense.cost &&
        e.date === expense.date &&
        e.category === expense.category
    );

    expensesGrid.innerHTML += `
      <div class="entry-item-container" data-exp-index="${realIndex}">
        <div class="edited-indicator" style="${expense.edited ? 'display:block' : ''}">Edited</div>
        <div class="category-container">
          <p class="category value-dark-mode js-category">
            ${expense.category}
          </p>
        </div>
        <div class="entry-item js-entry-item">
          <p class="label">Expense name:</p>
          <p class="value">${expense.name}</p>
          <p class="label">Amount spent:</p>
          <p class="value amount js-amount">Ksh. 
            ${expense.cost}
          </p>
          <p class="label">Date:</p>
          <p class="value">
            ${expense.date}
          </p>
          <div class="entry-buttons">
            <button class="delete-button js-delete-button" data-index="${realIndex}">
              Delete
            </button>
            <button class="edit-button js-edit-button" data-index="${realIndex}">
              Edit
            </button>
          </div>
        </div>
      </div>
      `;
  });

  applyCategoryStyles();
  applyHighCostStyles();
  attachEventListeners();
}

displayExpenses(expenses);

function applyCategoryStyles() {
  const domCategories = document.querySelectorAll(".js-category");

  document.querySelectorAll(".js-category").forEach((categoryElement) => {
    if (categoryElement.textContent.trim().toLowerCase() === "food") {
      categoryElement.classList.add("food");
    } else if (categoryElement.textContent.trim().toLowerCase() === "transport") {
      categoryElement.classList.add("transport");
    } else if (categoryElement.textContent.trim().toLowerCase() === "entertainment") {
      categoryElement.classList.add("entertainment");
    } else if (categoryElement.textContent.trim().toLowerCase() === "shopping") {
      categoryElement.classList.add("shopping");
    } else if (categoryElement.textContent.trim().toLowerCase() === "bills") {
      categoryElement.classList.add("bills");
    } else if (categoryElement.textContent.trim().toLowerCase() === "health") {
      categoryElement.classList.add("health");
    } else if (categoryElement.textContent.trim().toLowerCase() === "other") {
      categoryElement.classList.add("other");
    }
  });
}

function applyHighCostStyles() {
  const domAmounts = document
    .querySelectorAll(".js-amount");

  document
    .querySelectorAll(".js-amount").forEach((amountElement) => {
      const cost = Number(amountElement.innerText.slice(4));
      if (cost >= 1000) {
        amountElement.classList.add("high-amount");
      }
    });
}

// Tracks the current filtered+sorted result so search can narrow within it
let activeFilteredExpenses = null;

const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  // Search within the active filtered set, or all expenses if no filter applied
  const base = activeFilteredExpenses || JSON.parse(localStorage.getItem("expenses")) || [];

  const searched = base.filter((expense) =>
    expense.category.toLowerCase().includes(searchTerm) ||
    expense.name.toLowerCase().includes(searchTerm)
  );

  displayExpenses(searched);
  updateExpenseNum(searched);
});

applyFilters();
function applyFilters() {
  document.querySelector(".confirm").addEventListener("click", () => {
    const currentExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // --- Category filter (checkboxes — all can be active together) ---
    const selectedCategories = [
      foodFilter.checked && "Food",
      transportFilter.checked && "Transport",
      entertainMentFilter.checked && "Entertainment",
      shoppingFilter.checked && "Shopping",
      billsFilter.checked && "Bills",
      healthFilter.checked && "Health",
      otherFilter.checked && "Other",
    ].filter(Boolean);

    // --- Period filter (radio — mutually exclusive) ---
    const periodFilterId = document.querySelector("input[name='period-added']:checked")?.id;

    // --- Amount range ---
    const from = Number(document.getElementById("from").value) || 0;
    const to = Number(document.getElementById("to").value) || Infinity;

    // --- Single sort dropdown ---
    const sortValue = document.getElementById("sort").value;

    let filtered = [...currentExpenses];

    // Apply category filter
    if (selectedCategories.length) {
      filtered = filtered.filter(e => selectedCategories.includes(e.category));
    }

    // Apply period filter
    if (periodFilterId) {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);

      // Get Monday of current week
      const dayOfWeek = now.getDay(); // 0=Sun 
      const diffToMonday = (dayOfWeek + 6) % 7;
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - diffToMonday);
      thisMonday.setHours(0, 0, 0, 0);

      // Get Monday of last week
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(thisMonday.getDate() - 7);
      const lastSunday = new Date(thisMonday);
      lastSunday.setDate(thisMonday.getDate() - 1);

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      filtered = filtered.filter(e => {
        const expDate = new Date(e.date);

        if (periodFilterId === "today-filter") {
          return e.date === todayStr;
        }
        if (periodFilterId === "this-week-filter") {
          return expDate >= thisMonday && expDate <= now;
        }
        if (periodFilterId === "last-week-filter") {
          return expDate >= lastMonday && expDate <= lastSunday;
        }
        if (periodFilterId === "this-month-filter") {
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        }
        return true;
      });
    }

    // Apply amount range filter
    filtered = filtered.filter(e => e.cost >= from && e.cost <= to);

    // Apply single sort (one clear choice, no conflict)
    if (sortValue === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortValue === "high-spend") {
      filtered.sort((a, b) => b.cost - a.cost);
    } else if (sortValue === "low-spend") {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (sortValue === "alpha-asc") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortValue === "alpha-desc") {
      filtered.sort((a, b) => b.category.localeCompare(a.category));
    }

    // Save this as the active filtered set so search can work within it
    activeFilteredExpenses = filtered;

    // Clear search box when new filter is applied so results aren't doubly narrowed
    searchInput.value = "";

    displayExpenses(filtered);
    updateExpenseNum(filtered);
  });
}

export function updateExpenseNum(expenses) {
  quantityIndicator.innerHTML =
    `${expenses.length}`;
}

if (expenses.length === 0) {
  expensesGrid.innerHTML = `<p class="no-expense-alert">No expenses yet. Start tracking by adding your first expense!</p>`;

  // expensesGrid.classList.remove("entries-grid");

  document.querySelector(".js-clear-all-button-container").innerHTML = "";
}


function deleteExpense(deleteButton) {
  const index = parseInt(deleteButton.getAttribute("data-index"));

  const container = deleteButton.closest(".entry-item-container");

  // adds a fade-out class so that the expense fades out of the page instead of snapping out
  container.classList.add("fade-out");

  setTimeout(() => {
    const currentExpenses =
      JSON.parse(localStorage.getItem("expenses")) || [];

    currentExpenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(currentExpenses));

    // Reset active filter so search works on full list after delete
    activeFilteredExpenses = null;

    displayExpenses(currentExpenses);
    updateExpenseNum(currentExpenses);
    calculateTotalExpenditure();
    renderExpenseChart();
    renderRecentExpenses();
  }, 300);
}

function attachEventListeners() {
  document
    .querySelectorAll(".js-delete-button").forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {

        renderConfirmationDialogue();

        document.querySelector(".js-yes-button").addEventListener("click", () => {

          closeDialogue(document
            .querySelector(".js-confirmation-dialogue"));

          deleteExpense(deleteButton);
        }, { once: true });

        document.querySelector(".js-no-button").addEventListener("click", () => {
          closeDialogue(document
            .querySelector(".js-confirmation-dialogue"));
        }, { once: true });
      });
    });

  document
    .querySelectorAll(".js-edit-button").forEach((editButton) => {
      editButton.addEventListener("click", () => {
        const index = parseInt(editButton.getAttribute("data-index"));
        const currentExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

        renderEditDialogue();

        document.getElementById("description-edit").value = currentExpenses[index].name;

        document.getElementById("amount-edit").value = `${currentExpenses[index].cost}`;

        document.getElementById("category-edit").value = currentExpenses[index].category;

        document.getElementById("date-edit").value = currentExpenses[index].date;

        let timeoutId;

        document
          .querySelector(".js-save-button")
          .addEventListener("click", () => {
            const newName = document.getElementById("description-edit").value.trim();
            const newCost = Number(document.getElementById("amount-edit").value);
            const newCategory = document
              .getElementById("category-edit")
              .value.trim();
            const newDate = document.getElementById("date-edit").value.trim();


            if (!newName || !newCategory || !newDate) {
              document
                .querySelector(".js-edit-alert").classList.add("active");
              document
                .querySelector(".js-edit-alert").textContent =
                `Please fill all fields!`;

              clearTimeout(timeoutId);

              timeoutId = setTimeout(() => {
                document
                  .querySelector(".js-edit-alert").classList.remove("active");
              }, 3000);
              return;
            }

            if (!newCost || newCost <= 0) {
              document
                .querySelector(".js-edit-alert").classList.add("active");
              document
                .querySelector(".js-edit-alert").textContent = `Unexpected input!`;

              clearTimeout(timeoutId);

              timeoutId = setTimeout(() => {
                document
                  .querySelector(".js-edit-alert").classList.remove("active");
              }, 3000);
              return;
            }


            editExpense(index, currentExpenses); // pass it in
            localStorage.setItem("expenses", JSON.stringify(currentExpenses));

            const freshExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

            displayExpenses(freshExpenses);
            renderExpenseChart();
            renderRecentExpenses();

            closeDialogue(document
              .querySelector(".js-edit-dialogue"));
          }, { once: true });

        document
          .querySelector(".js-cancel-button")
          .addEventListener("click", () => {
            closeDialogue(document
              .querySelector(".js-edit-dialogue"));
          }, { once: true });
      });
    });
}

// edit an expense
function editExpense(index, expenses) {
  if (!document.getElementById("description-edit").value) {
    // keep existing
  } else {
    expenses[index].name = document
      .getElementById("description-edit")
      .value.trim();
  }

  if (!Number(document.getElementById("amount-edit").value)) {
    // keep existing
  } else {
    expenses[index].cost = Number(document.getElementById("amount-edit").value);
  }

  if (!document.getElementById("category-edit").value) {
    // keep existing
  } else {
    expenses[index].category = document
      .getElementById("category-edit")
      .value.trim();
  }

  if (!document.getElementById("date-edit").value) {
    // keep existing
  } else {
    expenses[index].date = document.getElementById("date-edit").value.trim();
  }

  // Stamp the edited flag so it persists across rerenders
  expenses[index].edited = true;
}

function clearAllExpenses() {
  expenses.length = 0;
  activeFilteredExpenses = null;
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

if (clearAllButton) {
  clearAllButton.addEventListener("click", () => {
    renderConfirmationDialogue();

    overlay.classList.add("overlay-active");

    const yesButton = document.querySelector(".js-yes-button").addEventListener("click", () => {
      closeDialogue(document
        .querySelector(".js-confirmation-dialogue"));

      clearAllExpenses();
      updateExpenseNum(expenses);
      displayExpenses(expenses);
      calculateTotalExpenditure();
      renderExpenseChart();
      renderRecentExpenses();
    });

    const noButton = document.querySelector(".js-no-button").addEventListener("click", () => {
      closeDialogue(document
        .querySelector(".js-confirmation-dialogue"));
    });
  });
}