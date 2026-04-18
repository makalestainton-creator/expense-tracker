import { renderExpenseChart } from "./chart.js";

const buttonElement = document.querySelector(".js-change-theme-button");

export function changeTheme() {
  if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  buttonElement.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
    renderExpenseChart();
  });
}

