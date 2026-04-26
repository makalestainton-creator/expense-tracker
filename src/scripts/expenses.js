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
const downloadButton = document
  .querySelector(".js-download-button");


updateExpenseNum(expenses);
openFilterMenu();

export function displayExpenses(expenses) {
  expensesGrid.innerHTML = "";

  // generates the HTML for each expense
  expenses.forEach((expense, index) => {
    const expenseIndex = expenses.indexOf(expense);
    expensesGrid.innerHTML += `
      <div class="entry-item-container" data-exp-index="${expenseIndex}">
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
            <button class="delete-button js-delete-button" data-index="${index}">
              Delete
            </button>
            <button class="edit-button js-edit-button" data-index="${index}">
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

const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = expenses.filter((expense) => {
    return (
      expense.category.toLowerCase().includes(searchTerm) ||
      expense.name.toLowerCase().includes(searchTerm)
    );
  });

  displayExpenses(filtered);
});

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

    displayExpenses(currentExpenses);
    updateExpenseNum(currentExpenses);
    calculateTotalExpenditure();
    renderExpenseChart();
    renderRecentExpenses();
  }, 300);
}

function attachEventListeners() {
  const deleteButtons = document
    .querySelectorAll(".js-delete-button");
  const yesButton = document.querySelector(".js-yes-button");
  const confirmationDialogue = document
    .querySelector(".js-confirmation-dialogue");
  const noButton = document.querySelector(".js-no-button");
  const editButtons = document
    .querySelectorAll(".js-edit-button");
  const editDialogue = document
    .querySelector(".js-edit-dialogue");
  const saveButton = document
    .querySelector(".js-save-button");
  const cancelButton = document
    .querySelector(".js-cancel-button");
  const editError = document
    .querySelector(".js-edit-alert");

  document
    .querySelectorAll(".js-delete-button").forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        //  displays the confirmation dialogue and activates overlay to avoid interactivity with the rest of the page when the dialogue is active
        renderConfirmationDialogue();

        document.querySelector(".js-yes-button").addEventListener("click", () => {
          // removes the dialogue and the overlay once we click the button
          closeDialogue(document
            .querySelector(".js-confirmation-dialogue"));

          deleteExpense(deleteButton);
        }, {once: true});

        document.querySelector(".js-no-button").addEventListener("click", () => {
          // removes the dialogue and overlay and does nothing more
          closeDialogue(document
            .querySelector(".js-confirmation-dialogue"));
        }, {once: true});
      });
    });

  document
    .querySelectorAll(".js-edit-button").forEach((editButton) => {
      editButton.addEventListener("click", () => {
        const index = parseInt(editButton.getAttribute("data-index"));
        const currentExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

        renderEditDialogue();

        // this section displays the value of the expense labels in the in input field before editing
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
  const previousExpenses = expenses;

  if (!document.getElementById("description-edit").value) {
    expenses[index].name = previousExpenses.name;
  } else {
    expenses[index].name = document
      .getElementById("description-edit")
      .value.trim();
  }

  if (!Number(document.getElementById("amount-edit").value)) {
    expenses[index].cost = previousExpenses.cost;
  } else {
    expenses[index].cost = Number(document.getElementById("amount-edit").value);
  }

  if (!document.getElementById("category-edit").value) {
    expenses[index].category = previousExpenses.category;
  } else {
    expenses[index].category = document
      .getElementById("category-edit")
      .value.trim();
  }

  if (!document.getElementById("date-edit").value) {
    expenses[index].date = previousExpenses.date;
  } else {
    expenses[index].date = document.getElementById("date-edit").value.trim();
  }
}

function clearAllExpenses() {
  expenses.length = 0;

  localStorage.setItem("expenses", JSON.stringify(expenses));
}


const overlay = document
  .querySelector(".js-overlay");
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

function downloadExpensesAsCSV(expenses) {
  // Step 2: Create CSV string
  let csv = "Date,Category,Amount,Description\n";
  expenses.forEach((exp) => {
    csv += `${exp.date},${exp.category},${exp.amount},${exp.name}\n`;
  });

  // Step 3: Create blob
  const blob = new Blob([csv], { type: "text/csv" });

  // Step 4: Create URL
  const url = URL.createObjectURL(blob);

  // Step 5: Create link
  const link = document.createElement("a");
  link.href = url;
  link.download = "my-expenses.csv";

  // Step 6: Trigger download
  link.click();

  // Step 7: Clean up
  URL.revokeObjectURL(url);
}

downloadButton.addEventListener("click", () => {
  downloadExpensesAsCSV(expenses);
});
if (expenses.length === 0) {
  downloadButton.classList.add("inactive");
}

