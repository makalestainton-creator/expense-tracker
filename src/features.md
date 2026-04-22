For that use case, a `<details>` + `<summary>` element is actually a great fit — no JavaScript needed for the open/close, and it's accessible out of the box. The hover behavior would need a small JS or CSS trick since `<details>` is click-based natively, but it's doable with pure CSS using `:hover` on the details element itself.

Here's the rough approach:

```css
details[open],
details:hover {
  open: true; /* doesn't work — CSS can't set HTML attributes */
}
```

That won't work. So you have two clean options:

**Option 1 — Pure CSS with a fake dropdown (no `<details>`)**
Use a hidden checkbox or a focusable element + sibling combinator. Works but is a bit hacky semantically.

**Option 2 — `<details>` + a tiny JS hover shim (recommended)**
Keep the semantic benefits of `<details>` and just add hover open/close in JS:

```js
const filterDetails = document.querySelector('.js-filter-details');

filterDetails.addEventListener('mouseenter', () => filterDetails.open = true);
filterDetails.addEventListener('mouseleave', () => filterDetails.open = false);
```

Then inside it you'd have your filter controls — category checkboxes, a date range picker, amount range, sort order, etc. — and a button to apply them which calls `displayExpenses()` with the filtered array.

A few things worth thinking through before you build it:

- **Hover on mobile** doesn't exist, so you'd want the click behavior `<details>` gives you for free to serve as the fallback — which it already does.
- **Where exactly** after the header — directly below the `.entries-title`, or fixed/sticky below the app header?
- **Apply on change vs. apply on button click** — instant filtering as you tick options feels snappier, but a confirm button avoids re-rendering on every checkbox tick.

What filters are you thinking — category, date range, amount, sort order?

<!-- **next -->

Here's a solid set of filters that would work well with your existing data structure:

**Filtering (narrow down what shows)**
- **Category** — checkboxes for Food, Transport, Entertainment, etc. Most useful since you already have category styles built out
- **Date range** — a "from" and "to" date input, pairs perfectly with your existing `expense.date` field
- **Amount range** — min/max inputs, and your `high-amount` style (≥1000) could even be a quick toggle
- **Search by name** — you already have the search input scaffolded but commented out in `expenses.js`, this would be the place to revive it

**Sorting (reorder what shows)**
- **Date** — newest first / oldest first
- **Amount** — highest first / lowest first
- **Category** — alphabetical grouping

**Quick presets (one-click filters, very satisfying UX)**
- *This month* — filter to current month's expenses only
- *High spend* — only expenses ≥ Ksh 1,000
- *Today* — just today's entries

---

The beauty of your setup is that all of these operate on the in-memory `expenses` array and just call `displayExpenses(filtered)` — none of them need to touch localStorage. The pattern would be:

```js
function applyFilters() {
  let filtered = [...expenses];

  // each filter narrows the array down
  if (selectedCategories.length) {
    filtered = filtered.filter(e => selectedCategories.includes(e.category));
  }
  if (minAmount) {
    filtered = filtered.filter(e => e.cost >= minAmount);
  }
  // ...etc

  displayExpenses(filtered);
}
```

A natural priority order to build them in would be: **category checkboxes → search → sort → date range → amount range → presets**, since each one builds on the same filtering pattern and gets progressively more involved.

Which of these would you like to start with?