const confirmationDialogue = document.querySelector(
  ".js-confirmation-dialogue",
);
const editDialogue = document.querySelector(".js-edit-dialogue");
const menuOpenBtn = document.querySelector(".menu-open");
const menuCloseBtn = document.querySelector(".close-menu-btn");
const menuFilter = document.querySelector(".menu-container");
import alertSVG from "../icons/alert-circle.svg";

export function renderConfirmationDialogue(okContent, cancelContent) {
  confirmationDialogue.innerHTML = `
    <p>Are you sure you want to proceed? <strong>This action cannot be undone</strong></p>
    <div class="dialogue-buttons">
      <button class="yes-button js-yes-button">
        ${okContent}
      </button>
      <button class="no-button js-no-button">
        ${cancelContent}
      </button>
    </div>
  `;

  confirmationDialogue.classList.add("overlay-active");
  document.querySelector(".js-overlay").classList.add("overlay-active");
}

export function renderEditDialogue() {
  editDialogue.innerHTML = `<div class="expense-grid">
      <label for="description-edit">Description:</label>
      <div>
        <input
          type="text"
          class="expense-input js-expense-input js-expense-description-input"
          placeholder="Expense description"
          id="description-edit"
        />
        <span class="exp-error exp-description-error">
          <img src="${alertSVG}" />
          Description is required
        </span>
      </div>
      <label for="amount-edit">Amount:</label>

      <div>
        <div class="prefix-container">
          <span class="prefix">Ksh.</span>
          <input
            type="text"
            class="expense-input js-expense-input js-expense-amount-input amount-input"
            placeholder="0.00"
            id="amount-edit"
          />
        </div>
        <span class="exp-error exp-amount-error">
          <img src="${alertSVG}" />
          Enter a valid amount
        </span>
      </div>
      <label for="category-edit">Category:</label>
      <select
        id="category-edit"
        class="expense-input js-expense-input js-expense-category-input"
      >
        <button>
          <selectedcontent></selectedcontent>
        </button>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>
      <label for="date-edit">Date:</label>
      <div>
        <input
          type="date"
          class="expense-input js-expense-input js-expense-date-input"
          id="date-edit"
        />
        <span class="exp-error exp-date-error">
          <img src="${alertSVG}" />
          Please choose a date
        </span>
      </div>

      <div class="dialogue-buttons">
        <button class="save-button js-save-button">
          Save
        </button>
        <button class="cancel-button js-cancel-button">
          Cancel
        </button>
      </div>

    </div>
    `;

  editDialogue.classList.add("overlay-active");
  document.querySelector(".js-overlay").classList.add("overlay-active");
}

export function closeDialogue(containerElement) {
  containerElement.classList.remove("overlay-active");
  document.querySelector(".js-overlay").classList.remove("overlay-active");
}

export function openFilterMenu() {
  menuOpenBtn.addEventListener("click", () => {
    menuFilter.classList.add("open");
  });

  document.addEventListener("click", (e) => {
    if (!menuFilter.contains(e.target) && !menuOpenBtn.contains(e.target)) {
      menuFilter.classList.remove("open");
    }
  });

  menuCloseBtn.addEventListener("click", () => {
    menuFilter.classList.remove("open");
  });
}
