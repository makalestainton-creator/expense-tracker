import dayjs from "dayjs";
import { displayExpenses, updateExpenseNum } from "./expenses.js";

const searchInput = document.querySelector("#search");
const categoryPills = document.querySelectorAll(".js-category-pill");
const datePills = document.querySelectorAll(".js-date-pill");
const sortSelect = document.querySelector("#sort-select");

let initialized = false;

// Always read the latest data. Never filter a stale snapshot.
function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses")) || [];
}

// Build date boundaries using Monday as the first day of the week.
function getDateRange(range) {
  const today = dayjs().startOf("day");
  const mondayOffset = (today.day() + 6) % 7;

  const thisWeekStart = today.subtract(mondayOffset, "day");
  const thisWeekEnd = thisWeekStart.add(6, "day").endOf("day");

  switch (range) {
    case "today":
      return [today, today.endOf("day")];

    case "week":
      return [thisWeekStart, thisWeekEnd];

    case "last-week": {
      const start = thisWeekStart.subtract(1, "week");
      return [start, start.add(6, "day").endOf("day")];
    }

    case "month":
      return [today.startOf("month"), today.endOf("month")];

    default:
      return null;
  }
}

function matchesDateRange(expense, range) {
  if (!range) return true;

  const expenseDate = dayjs(expense.date);

  if (!expenseDate.isValid()) return false;

  const [start, end] = getDateRange(range);

  return (
    !expenseDate.isBefore(start, "day") && !expenseDate.isAfter(end, "day")
  );
}

function sortExpenses(expenses, sortValue) {
  const sorted = [...expenses];

  switch (sortValue) {
    case "newest":
      return sorted.sort(
        (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
      );

    case "oldest":
      return sorted.sort(
        (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      );

    case "highest":
      return sorted.sort((a, b) => Number(b.cost) - Number(a.cost));

    case "lowest":
      return sorted.sort((a, b) => Number(a.cost) - Number(b.cost));

    case "alpha-asc":
      return sorted.sort((a, b) =>
        a.category.localeCompare(b.category, undefined, {
          sensitivity: "base",
        }),
      );

    case "alpha-desc":
      return sorted.sort((a, b) =>
        b.category.localeCompare(a.category, undefined, {
          sensitivity: "base",
        }),
      );

    case "none":
    default:
      return sorted;
  }
}

// The single rendering pipeline for every filter and search interaction.
export function refreshExpenseFilters() {
  const storedExpenses = getExpenses();

  // Preserve original storage indices for correct edit/delete operations.
  let results = storedExpenses.map((expense, index) => ({
    ...expense,
    __originalIndex: index,
  }));

  const selectedCategories = [...categoryPills]
    .filter((pill) => pill.classList.contains("active"))
    .map((pill) => pill.dataset.category.toLowerCase());

  const activeDatePill = [...datePills].find((pill) =>
    pill.classList.contains("active"),
  );

  const selectedDateRange = activeDatePill?.dataset.dateRange ?? null;

  const searchTerm = searchInput.value.trim().toLowerCase();
  const sortValue = sortSelect.value;

  // 1. Categories: multiple selections use OR logic.
  if (selectedCategories.length > 0) {
    results = results.filter((expense) =>
      selectedCategories.includes(expense.category.toLowerCase()),
    );
  }

  // 2. Date range.
  if (selectedDateRange) {
    results = results.filter((expense) =>
      matchesDateRange(expense, selectedDateRange),
    );
  }

  // 3. Search: narrows the category/date results.
  if (searchTerm) {
    results = results.filter((expense) =>
      [expense.name, expense.category, expense.cost, expense.date].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchTerm),
      ),
    );
  }

  // 4. Sorting: applied last to the remaining results.
  results = sortExpenses(results, sortValue);

  displayExpenses(results);
  updateExpenseNum(results);

  return results;
}

export function applyFilters() {
  if (initialized) {
    return refreshExpenseFilters();
  }

  initialized = true;

  categoryPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pill.classList.toggle("active");
      refreshExpenseFilters();
    });
  });

  datePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const wasActive = pill.classList.contains("active");

      // Only one date range can be active at a time.
      datePills.forEach((datePill) => {
        datePill.classList.remove("active");
      });

      // Clicking the selected date range again clears it.
      if (!wasActive) {
        pill.classList.add("active");
      }

      refreshExpenseFilters();
    });
  });

  searchInput.addEventListener("input", refreshExpenseFilters);

  sortSelect.addEventListener("change", refreshExpenseFilters);

  return refreshExpenseFilters();
}
