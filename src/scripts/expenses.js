import { renderExpenseChart } from "./utils/chart.js";
import { renderRecentExpenses } from "./recents.js";
import { calculateTotalExpenditure } from "./expenseSummary.js";
import { renderConfirmationDialogue } from "./dialogues.js";
import { closeDialogue, renderEditDialogue } from "./dialogues.js";
import { applyFilters, refreshExpenseFilters } from "./filterExpenses.js";

const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const expensesGrid = document.querySelector(".js-entries-grid");
const quantityIndicator = document.querySelector(".js-expense-quantity");
const clearAllButton = document.querySelector(".js-clear-all-button");
const overlay = document.querySelector(".js-overlay");
const categoryScroll = document.querySelector(".category-pills");
const dateScroll = document.querySelector(".date-pills");
const categoryRightChevron = document.querySelector(".category-right-chevron");
const categoryLeftChevron = document.querySelector(".category-left-chevron");
const dateRightChevron = document.querySelector(".date-right-chevron");
const dateLeftChevron = document.querySelector(".date-left-chevron");
import TomSelect from "tom-select";

updateExpenseNum(expenses);
applyFilters();

function scrollFilterRow(element, direction) {
  element.scrollBy({
    left: direction * element.clientWidth * 0.7,
    behavior: "smooth",
  });
}

categoryRightChevron.addEventListener("click", () => {
  scrollFilterRow(categoryScroll, 1);
});

categoryLeftChevron.addEventListener("click", () => {
  scrollFilterRow(categoryScroll, -1);
});

dateRightChevron.addEventListener("click", () => {
  scrollFilterRow(dateScroll, 1);
});

dateLeftChevron.addEventListener("click", () => {
  scrollFilterRow(dateScroll, -1);
});

// Show arrows only when scrolling in that direction is possible.
function updateFilterChevrons(left, right, element) {
  const maxScroll = element.scrollWidth - element.clientWidth;
  const hasOverflow = maxScroll > 2;

  left.hidden = !hasOverflow || element.scrollLeft <= 2;
  right.hidden = !hasOverflow || element.scrollLeft >= maxScroll - 2;
}

function updateAllChevrons() {
  updateFilterChevrons(
    categoryLeftChevron,
    categoryRightChevron,
    categoryScroll,
  );

  updateFilterChevrons(dateLeftChevron, dateRightChevron, dateScroll);
}

categoryScroll.addEventListener("scroll", updateAllChevrons, {
  passive: true,
});

dateScroll.addEventListener("scroll", updateAllChevrons, {
  passive: true,
});

window.addEventListener("resize", updateAllChevrons);

const chevronObserver = new ResizeObserver(updateAllChevrons);

chevronObserver.observe(categoryScroll);
chevronObserver.observe(dateScroll);

// Run after the initial layout is available.
requestAnimationFrame(updateAllChevrons);

export function displayExpenses(expenses) {
  expensesGrid.innerHTML = "";

  // Always read from localStorage to get true indices for delete/edit
  const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

  expenses.forEach((expense) => {
    // Find the real index in the full array so delete/edit always hit the right item
    const realIndex = Number.isInteger(expense.__originalIndex)
      ? expense.__originalIndex
      : allExpenses.findIndex(
          (e) =>
            e.name === expense.name &&
            e.cost === expense.cost &&
            e.date === expense.date &&
            e.category === expense.category,
        );

    expensesGrid.innerHTML += `
      <div class="entry-item-container" data-exp-index="${realIndex}">
        <div class="edited-indicator" style="${expense.edited ? "display:block" : ""}">Edited</div>
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

function applyCategoryStyles() {
  document.querySelectorAll(".js-category").forEach((categoryElement) => {
    if (categoryElement.textContent.trim().toLowerCase() === "food") {
      categoryElement.classList.add("food");
    } else if (
      categoryElement.textContent.trim().toLowerCase() === "transport"
    ) {
      categoryElement.classList.add("transport");
    } else if (
      categoryElement.textContent.trim().toLowerCase() === "entertainment"
    ) {
      categoryElement.classList.add("entertainment");
    } else if (
      categoryElement.textContent.trim().toLowerCase() === "shopping"
    ) {
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
  document.querySelectorAll(".js-amount").forEach((amountElement) => {
    const cost = Number(amountElement.innerText.slice(4));
    if (cost >= 1000) {
      amountElement.classList.add("high-amount");
    }
  });
}

export function updateExpenseNum(expenses) {
  quantityIndicator.innerHTML = `${expenses.length}`;
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
    const currentExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    currentExpenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(currentExpenses));

    refreshExpenseFilters();
    calculateTotalExpenditure();
    renderExpenseChart();
    renderRecentExpenses();
  }, 300);
}

function attachEventListeners() {
  document.querySelectorAll(".js-delete-button").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      renderConfirmationDialogue("Yes, Delete", "No, Keep it");

      document.querySelector(".js-yes-button").addEventListener(
        "click",
        () => {
          closeDialogue(document.querySelector(".js-confirmation-dialogue"));

          deleteExpense(deleteButton);
        },
        { once: true },
      );

      document.querySelector(".js-no-button").addEventListener(
        "click",
        () => {
          closeDialogue(document.querySelector(".js-confirmation-dialogue"));
        },
        { once: true },
      );
    });
  });

  document.querySelectorAll(".js-edit-button").forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const index = parseInt(editButton.getAttribute("data-index"));
      const currentExpenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

      renderEditDialogue();

      const editCategorySelect = new TomSelect("#category-edit", {
        create: false,
        controlInput: null,
      });

      editCategorySelect.setValue(currentExpenses[index].category);

      document.getElementById("description-edit").value =
        currentExpenses[index].name;

      document.getElementById("amount-edit").value =
        `${currentExpenses[index].cost}`;

      document.getElementById("date-edit").value = currentExpenses[index].date;

      document
        .querySelector(".js-save-button")
        .addEventListener("click", () => {
          const newDescription = document
            .getElementById("description-edit")
            .value.trim();
          const newCost = Number(document.getElementById("amount-edit").value);
          const newDate = document.getElementById("date-edit").value.trim();

          document.querySelectorAll(".exp-error").forEach((elm) => {
            elm.classList.remove("visible");
          });

          let hasError = false;

          if (!newDescription) {
            document
              .querySelector(".exp-description-error")
              .classList.add("visible");
            hasError = true;
          }

          if (newCost <= 0 || newCost !== Number(newCost)) {
            document
              .querySelector(".exp-amount-error")
              .classList.add("visible");
            hasError = true;
          }

          if (!newDate) {
            document.querySelector(".exp-date-error").classList.add("visible");
            hasError = true;
          }

          if (hasError) return;

          document
            .querySelector(".js-save-button")
            .removeEventListener("click", this);

          // In the save button listener, replace the editExpense call:
          editExpense(index, currentExpenses, editCategorySelect.getValue());
          localStorage.setItem("expenses", JSON.stringify(currentExpenses));

          refreshExpenseFilters();
          renderExpenseChart();
          renderRecentExpenses();

          closeDialogue(document.querySelector(".js-edit-dialogue"));
        });

      document.querySelector(".js-cancel-button").addEventListener(
        "click",
        () => {
          closeDialogue(document.querySelector(".js-edit-dialogue"));
        },
        { once: true },
      );
    });
  });
}

function editExpense(index, expenses, newCategoryValue) {
  if (!document.getElementById("description-edit").value) {
    // keep existing
  } else {
    expenses[index].name = document
      .getElementById("description-edit")
      .value.trim();
    expenses[index].edited = true;
  }

  if (!Number(document.getElementById("amount-edit").value)) {
    // keep existing
  } else {
    expenses[index].cost = Number(document.getElementById("amount-edit").value);
    expenses[index].edited = true;
  }

  if (!document.getElementById("date-edit").value) {
    // keep existing
  } else {
    expenses[index].date = document.getElementById("date-edit").value.trim();
    expenses[index].edited = true;
  }

  expenses[index].edited = false;

  if (newCategoryValue) {
    expenses[index].category = newCategoryValue;
    expenses[index].edited = true;
  }
}

function clearAllExpenses() {
  expenses.length = 0;
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

if (clearAllButton) {
  clearAllButton.addEventListener("click", () => {
    renderConfirmationDialogue("Yes, proceed", "No, cancel");

    overlay.classList.add("overlay-active");

    document.querySelector(".js-yes-button").addEventListener("click", () => {
      closeDialogue(document.querySelector(".js-confirmation-dialogue"));

      clearAllExpenses();
      refreshExpenseFilters();
      calculateTotalExpenditure();
      renderExpenseChart();
      renderRecentExpenses();
    });

    document.querySelector(".js-no-button").addEventListener("click", () => {
      closeDialogue(document.querySelector(".js-confirmation-dialogue"));
    });
  });
}
