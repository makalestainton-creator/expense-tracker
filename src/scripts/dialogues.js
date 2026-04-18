export function renderConfirmationDialogue() {
  document.querySelector(".js-confirmation-dialogue").innerHTML = `
    <div class="confirmation-dialogue-container">
      <p>Are you sure you want to proceed? <strong>This action cannot be undone</strong></p>
      <div class="dialogue-buttons">
        <button class="yes-button js-yes-button">
          Yes
        </button>
        <button class="no-button js-no-button">
          No
        </button>
      </div>
    </div>
  `;

  document
    .querySelector(".js-dialogue-overlay")
    .classList.add("dialogue-overlay-active");
}

export function renderEditDialogue() {
  document.querySelector(".js-edit-dialogue").innerHTML =
    `<div class="expense-grid">
      <label for="description">Description:</label>
      <input
        type="text"
        class="expense-input js-expense-input js-expense-description-input"
        placeholder="Expense description"
        id="description"
      />
      <label for="amount">Amount:</label>

      <div class="prefix-container">
        <span class="prefix">Ksh.</span>
        <input
          type="text"
          class="expense-input js-expense-input js-expense-amount-input amount-input"
          placeholder="0.00"
          id="amount"
        />
      </div>
      <label for="category">Category:</label>
      <select
        id="category"
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
      <label for="date">Date:</label>
      <input
        type="date"
        class="expense-input js-expense-input js-expense-date-input"
        id="date"
      />

      <button class="save-button js-save-button">
        Save
      </button>
      <button class="cancel-button js-cancel-button">
        Cancel
      </button>

    </div>
    `;
  document
    .querySelector(".js-dialogue-overlay")
    .classList.add("dialogue-overlay-active");
}

export function removeDialogue(containerElement) {
  containerElement.innerHTML = "";
  document
    .querySelector(".js-dialogue-overlay")
    .classList.remove("dialogue-overlay-active");
}
