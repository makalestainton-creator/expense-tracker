import { displayExpenses } from "./expenses.js";
import { updateExpenseNum } from "./expenses.js";

const searchInput = document.querySelector("#search");
const foodFilter = document.getElementById("food-filter");
const transportFilter = document.getElementById("transport-filter");
const entertainMentFilter = document.getElementById("entertainment-filter");
const shoppingFilter = document.getElementById("shopping-filter");
const billsFilter = document.getElementById("bills-filter");
const healthFilter = document.getElementById("health-filter");
const otherFilter = document.getElementById("other-filter");

let activeFilteredExpenses = null;

export function applyFilters() {
  // Tracks the current filtered+sorted result so search can narrow within it
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    // Search within the active filtered set, or all expenses if no filter applied
    const base =
      activeFilteredExpenses ||
      JSON.parse(localStorage.getItem("expenses")) ||
      [];
  
    const searched = base.filter(
      (expense) =>
        expense.category.toLowerCase().includes(searchTerm) ||
        expense.name.toLowerCase().includes(searchTerm),
    );
  
    displayExpenses(searched);
    updateExpenseNum(searched);
    return;
  });

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
    const periodFilterId = document.querySelector(
      "input[name='period-added']:checked",
    )?.id;

    // --- Amount range ---
    const from = Number(document.getElementById("from").value) || 0;
    const to = Number(document.getElementById("to").value) || Infinity;

    // --- Single sort dropdown ---
    const sortValue = document.getElementById("sort").value;

    let filtered = [...currentExpenses];

    // Apply category filter
    if (selectedCategories.length) {
      filtered = filtered.filter((e) =>
        selectedCategories.includes(e.category),
      );
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

      filtered = filtered.filter((e) => {
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
          return (
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear
          );
        }
        return true;
      });
    }

    // Apply amount range filter
    filtered = filtered.filter((e) => e.cost >= from && e.cost <= to);

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
