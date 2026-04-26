const confirmationDialogue = document.querySelector(".js-confirmation-dialogue");
const editDialogue = document.querySelector(".js-edit-dialogue");
const menuOpenBtn = document.querySelector(".menu-open");
const menuCloseBtn = document.querySelector(".close-menu-btn")
const menuFilter = document.querySelector(".menu-container");
const detailsElms = document.querySelectorAll("details");

export function renderConfirmationDialogue() {
  confirmationDialogue.innerHTML = `
    <p>Are you sure you want to proceed? <strong>This action cannot be undone</strong></p>
    <div class="dialogue-buttons">
      <button class="yes-button js-yes-button">
        Yes, delete
      </button>
      <button class="no-button js-no-button">
        No, keep it
      </button>
    </div>
  `;

  confirmationDialogue.classList.add("overlay-active");
  document
    .querySelector(".js-overlay")
    .classList.add("overlay-active");
}

export function renderEditDialogue() {
  editDialogue.innerHTML =
    `<div class="expense-grid">
      <label for="description-edit">Description:</label>
      <input
        type="text"
        class="expense-input js-expense-input js-expense-description-input"
        placeholder="Expense description"
        id="description-edit"
      />
      <label for="amount-edit">Amount:</label>

      <div class="prefix-container">
        <span class="prefix">Ksh.</span>
        <input
          type="text"
          class="expense-input js-expense-input js-expense-amount-input amount-input"
          placeholder="0.00"
          id="amount-edit"
        />
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
      <input
        type="date"
        class="expense-input js-expense-input js-expense-date-input"
        id="date-edit"
      />

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
  document
    .querySelector(".js-overlay")
    .classList.add("overlay-active");
}

export function closeDialogue(containerElement) {
  containerElement.classList.remove("overlay-active");
  document
    .querySelector(".js-overlay")
    .classList.remove("overlay-active");
}


export function openFilterMenu() {
  menuOpenBtn.addEventListener("click", () => {
    menuFilter.classList.add("open");
  });

  document.addEventListener("click", (e) => {
    if (
      !menuFilter.contains(e.target) &&
      !menuOpenBtn.contains(e.target)
    ) {
      menuFilter.classList.remove("open")
    }
  });

  menuCloseBtn.addEventListener("click", () => {
    menuFilter.classList.remove("open");
  });

  // detailsElms.forEach((elm) => {
  //   elm.addEventListener('mouseenter', () => elm.open = true);
  //   elm.addEventListener('mouseleave', () => elm.open = false);
  // });
}
