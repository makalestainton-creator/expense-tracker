import { changeTheme } from "./utils/changeTheme.js";
import { renderConfirmationDialogue } from "./dialogues/dialogues.js";
import { removeDialogue, renderEditDialogue } from "./dialogues/dialogues.js";

// Loads expenses fresh from localStorage every time
renderExpenses();

changeTheme();

function renderExpenses() {
  // Load fresh from localStorage
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  displayExpenses(expenses);
  function displayExpenses(expenses) {
    let html = "";

    // generates the HTML for each expense
    expenses.forEach((expense, index) => {
      html += `
      <div class="entry-item-container">
        <p class="cartegory value-dark-mode js-cartegory">
          ${expense.cartegory}
        </p>
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
        </div>
        <div class="entry-buttons">
          <button class="delete-button js-delete-button" data-index="${index}">
            Delete
          </button>
          <button class="edit-button js-edit-button" data-index="${index}">
            Edit
          </button>
        </div>
      </div>
      `;
    });

    document.querySelector(".js-entries-grid").innerHTML = html;
    applyCartegoryStyles();
    applyHighCostStyles();
  }

  function applyCartegoryStyles() {
    document
      .querySelectorAll(".js-cartegory")
      .forEach((cartegoryElement) => {
        if (cartegoryElement.innerText.toLowerCase() === "food") {

          cartegoryElement.classList.add("food");

        } else if (cartegoryElement.innerText.toLowerCase() === "transport") {

          cartegoryElement.classList.add("transport");

        } else if (cartegoryElement.innerText.toLowerCase() === "entertainment") {

          cartegoryElement.classList.add("entertainment");

        } else if (cartegoryElement.innerText.toLowerCase() === "shopping") {

          cartegoryElement.classList.add("shopping");

        } else if (cartegoryElement.innerText.toLowerCase() === "bills") {

          cartegoryElement.classList.add("bills");

        } else if (cartegoryElement.innerText.toLowerCase() === "health") {

          cartegoryElement.classList.add("health");

        } else if (cartegoryElement.innerText.toLowerCase() === "other") {

          cartegoryElement.classList.add("other");

        }
      });
    }

  function applyHighCostStyles() {
    document.querySelectorAll(".js-amount").forEach((amountElement) => {
      const cost = Number(amountElement.innerText.slice(4));
      if(cost >= 1000) {
        amountElement.classList.add("high-amount");
      }
    });
  }

  const input = document.querySelector("#search-input");
  input.addEventListener("input", () => {
    const searchTerm = input.value.trim().toLowerCase();

    const filtered = expenses.filter((expense) => {
      return (
        expense.cartegory.toLowerCase().includes(searchTerm) ||
        expense.name.toLowerCase().includes(searchTerm)
      );
    });
    displayExpenses(filtered);
  });
  // renderExpenses();

  // making the tracking room header dynamic
  document.querySelector(
    ".js-expense-quantity"
  ).innerHTML = `${expenses.length}`;

  if (expenses.length === 0) {

    const entriesGrid = document.querySelector(".js-entries-grid");

    entriesGrid.innerHTML = `<p class="no-expense-alert">No expenses yet. Start tracking by adding your first expense!</p>`;

    entriesGrid.classList.remove("entries-grid");

    document.querySelector(".js-clear-all-button-container").innerHTML = "";
  }

  // deleting an expense

  function deleteExpense(deleteButton) {

    // gets the index of the delete button on the page to determine the expense to delete
    const index = parseInt(deleteButton.getAttribute("data-index"));

    const container = deleteButton.closest(".entry-item-container");

    // adds a fade-out class so that the expense fades out of the page instead of snapping out
    container.classList.add("fade-out");

    setTimeout(() => {
      // Load fresh from localStorage again
      const currentExpenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

      currentExpenses.splice(index, 1);

      localStorage.setItem("expenses", JSON.stringify(currentExpenses));

      renderExpenses();
    }, 300);
  }

  document.querySelectorAll(".js-delete-button").forEach((deleteButton) => {

    deleteButton.addEventListener("click", () => {
      //  displays the confirmation dialogue and activates overlay to avoid interactivity with the rest of the page when the dialogue is active
      renderConfirmationDialogue();

      const yesButton = document.querySelector(".js-yes-button");

      yesButton.addEventListener("click", () => {

        // removes the dialogue and the overlay once we click the button
        removeDialogue(document.querySelector(".js-confirmation-dialogue"));

        deleteExpense(deleteButton);
      });

      const noButton = document.querySelector(".js-no-button");

      noButton.addEventListener("click", () => {

        // removes the dialogue and overlay and does nothing more
        removeDialogue(document.querySelector(".js-confirmation-dialogue"));
      });
    });
  });

  // edit an expense

  function editExpense(index) {

    const previousExpenses = expenses; 

    if (document.querySelector(".js-edit-name").value === "") {
      expenses[index].name = previousExpenses.name;
    } else {
      expenses[index].name = document.querySelector(".js-edit-name").value;
    }

    if(Number(
      document.querySelector(".js-edit-cost").value
    ) === null) {
      expenses[index].cost = previousExpenses.cost;
    } else {
      expenses[index].cost = Number(
        document.querySelector(".js-edit-cost").value
      );
    }

    if(document.querySelector(".js-edit-cartegory").value === "") {
      expenses[index].cartegory = previousExpenses.cartegory;
    } else {
      expenses[index].cartegory =
        document.querySelector(".js-edit-cartegory").value;
    }

    if (document.querySelector(".js-edit-date").value === "") {
      expenses[index].date = previousExpenses.date;
    } else {
      expenses[index].date = document.querySelector(".js-edit-date").value;
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  document.querySelectorAll(".js-edit-button").forEach((editButton) => {

    editButton.addEventListener("click", () => {

      const index = parseInt(editButton.getAttribute("data-index"));

      renderEditDialogue();

      // this section displays the value of the expense labels in the in input field before editing
      document.querySelector(".js-edit-name").value = expenses[index].name;

      document.querySelector(".js-edit-cost").value = `${expenses[index].cost}`;

      document.querySelector(".js-edit-cartegory").value =
        expenses[index].cartegory;

      document.querySelector(".js-edit-date").value = expenses[index].date;

      let timeoutId;
      document
        .querySelector(".js-save-button")
        .addEventListener("click", () => {

          editExpense(index);
          
           if (
             !expenses[index].name ||
             !expenses[index].cartegory ||
             !expenses[index].date            
            ) {
            document.querySelector(".js-edit-alert").classList.add("active");
            document.querySelector(".js-edit-alert").innerHTML = `Please fill all fields!`;

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              document.querySelector(".js-edit-alert").classList.remove("active");
            }, 3000);
            return;
           }

           if (
             expenses[index].cost <= 0 ||
             expenses[index].cost !== Number(expenses[index].cost) || expenses[index].cost === null
           ) {
            document.querySelector(".js-edit-alert").classList.add("active");
            document.querySelector(
              ".js-edit-alert"
            ).innerHTML = `Unexpected input!`;

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              document
                .querySelector(".js-edit-alert")
                .classList.remove("active");
            }, 3000);
             return;
           }

          renderExpenses();

          removeDialogue(document.querySelector(".js-edit-dialogue"));

        });

      document
        .querySelector(".js-cancel-button")
        .addEventListener("click", () => {
          if (
            !expenses[index].name ||
            !expenses[index].cartegory ||
            !expenses[index].date
          ) {
            document.querySelector(".js-edit-alert").classList.add("active");
            document.querySelector(".js-edit-alert").innerHTML =
              `Please fill all fields!`;

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              document
                .querySelector(".js-edit-alert")
                .classList.remove("active");
            }, 3000);
            return;
          }

          if (
            expenses[index].cost <= 0 ||
            expenses[index].cost !== Number(expenses[index].cost) ||
            expenses[index].cost === null
          ) {
            document.querySelector(".js-edit-alert").classList.add("active");
            document.querySelector(".js-edit-alert").innerHTML =
              `Unexpected input!`;

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
              document
                .querySelector(".js-edit-alert")
                .classList.remove("active");
            }, 3000);
            return;
          }
          removeDialogue(document.querySelector(".js-edit-dialogue"));

        });
    });
  });

  function clearAllExpenses() {

    expenses.length = 0;

    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  const clearAllButton = document.querySelector(".js-clear-all-button");

  if (clearAllButton) {

    clearAllButton.addEventListener("click", () => {

      renderConfirmationDialogue();

      document
        .querySelector(".js-dialogue-overlay")
        .classList.add("dialogue-overlay-active");

      const yesButton = document.querySelector(".js-yes-button");

      yesButton.addEventListener("click", () => {

        removeDialogue(document.querySelector(".js-confirmation-dialogue"));

        clearAllExpenses();

        renderExpenses();

      });

      const noButton = document.querySelector(".js-no-button");

      noButton.addEventListener("click", () => {

       removeDialogue(document.querySelector(".js-confirmation-dialogue"));

      });
    });
  }
}
