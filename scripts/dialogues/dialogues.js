export function renderConfirmationDialogue() {
  document.querySelector(".js-confirmation-dialogue").innerHTML = `
    <div class="confirmation-dialogue-container">
      <p>Are you sure you want to clear all? <strong>This action cannot be undone</strong></p>
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
  document.querySelector(".js-edit-dialogue").innerHTML = `
    <div class="edit-dialogue-container">
      <div class="expense-properties">
        <p class="prompt">Description:</P>
        <input type="text" class="js-edit-name" value="">
        <p class="prompt">Amount spent:</p>
        <div class="prefix-container">
          <span class="prefix">Ksh.</span>
          <input type="text" class="edit-cost-input js-edit-cost" value="">
        </div>
        <p class="prompt">Cartegory:</p>
        <select class="js-edit-cartegory" value="">
          <option vlaue="Food">Food</option>
          <option vlaue="Transport">Transport</option>
          <option vlaue="Entertainment">Entertainment</option>
          <option vlaue="Shopping">Shopping</option>
          <option vlaue="Bills">Bills</option>
          <option vlaue="Health">Health</option>
          <option vlaue="Other">Other</option>
        </select>
        <p class="prompt">Date:</p>
        <input type="date" class="js-edit-date" value="">
      </div>
      <div class="edit-buttons">
        <button class="save-button js-save-button">
          Save
        </button>
        <button class="cancel-button js-cancel-button">
          Cancel
        </button>
      </div>
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