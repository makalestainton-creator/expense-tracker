😂 excavator analogy is perfect. Let me break it down piece by piece.

---

**Step 1 — get reference points**

```javascript
const now = new Date(); // right now, e.g. Friday June 6 2025
const todayStr = now.toISOString().slice(0, 10); // "2025-06-06" (just the date part)
```

`toISOString()` gives `"2025-06-06T10:30:00.000Z"`, `.slice(0, 10)` chops off the time part leaving just `"2025-06-06"`.

---

**Step 2 — find this Monday**

```javascript
const dayOfWeek = now.getDay(); // Sun=0, Mon=1, Tue=2... Sat=6

const diffToMonday = (dayOfWeek + 6) % 7;
// e.g. Friday: (5 + 6) % 7 = 11 % 7 = 4 days back to reach Monday
// e.g. Monday: (1 + 6) % 7 = 7 % 7 = 0 (already Monday, go back 0)
// e.g. Sunday: (0 + 6) % 7 = 6 % 7 = 6 days back to reach Monday

const thisMonday = new Date(now);
thisMonday.setDate(now.getDate() - diffToMonday); // rewind to Monday
thisMonday.setHours(0, 0, 0, 0); // set to midnight so whole day is included
```

---

**Step 3 — find last week's Monday and Sunday**

```javascript
const lastMonday = new Date(thisMonday);
lastMonday.setDate(thisMonday.getDate() - 7); // go back 7 days from this Monday

const lastSunday = new Date(thisMonday);
lastSunday.setDate(thisMonday.getDate() - 1); // one day before this Monday = last Sunday
```

So last week is the range **lastMonday → lastSunday**.

---

**Step 4 — the actual filtering**

```javascript
filtered = filtered.filter((e) => {
  const expDate = new Date(e.date); // turn "2025-06-06" string into a real Date object

  if (periodFilterId === "today-filter") return e.date === todayStr; // simple string compare, "2025-06-06" === "2025-06-06"

  if (periodFilterId === "this-week-filter")
    return expDate >= thisMonday && expDate <= now; // between Monday and right now

  if (periodFilterId === "last-week-filter")
    return expDate >= lastMonday && expDate <= lastSunday; // between last Mon and last Sun

  if (periodFilterId === "this-month-filter")
    return (
      expDate.getMonth() === currentMonth && // same month number (0-11)
      expDate.getFullYear() === currentYear
    ); // AND same year

  return true; // no filter matched, keep everything
});
```

---

**On your dayjs question** — honestly for this specific case, spoon is fine 😄 You're just doing date comparisons, and native `Date` handles it cleanly. dayjs would make it slightly more readable:

```javascript
// Native Date version:
const diffToMonday = (dayOfWeek + 6) % 7;
const thisMonday = new Date(now);
thisMonday.setDate(now.getDate() - diffToMonday);

// dayjs version:
const thisMonday = dayjs().startOf("week"); // one line, same result
```

So dayjs would shorten it, but it's not necessary — the native code works perfectly. Since you're already importing dayjs elsewhere in the project it wouldn't even be an extra dependency, but it's your call.

```css
.hourly-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-behavior: smooth;

  /* Hide scrollbar (Firefox / IE-Edge legacy) */
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

/* Hide scrollbar (WebKit/Chromium) */
.hourly-scroll::-webkit-scrollbar {
  display: none;
}

.hour-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-width: 3.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.6rem 0.4rem;

  scroll-snap-align: start;
}
```

```javascript
rightChevron.addEventListener("click", () => {
  hourlyScroll.scrollBy({
    left: 50,
    behavior: "smooth",
  });
});

leftChevron.addEventListener("click", () => {
  hourlyScroll.scrollBy({
    left: -50,
    behavior: "smooth",
  });
});

function updateHourlyChevrons() {
  const maxScroll = hourlyScroll.scrollWidth - hourlyScroll.clientWidth;
  leftChevron.style.visibility =
    hourlyScroll.scrollLeft <= 5 ? "hidden" : "visible";
  rightChevron.style.visibility =
    hourlyScroll.scrollLeft >= maxScroll - 5 ? "hidden" : "visible";
}

hourlyScroll.addEventListener("scroll", updateHourlyChevrons, {
  passive: true,
});
window.addEventListener("resize", () => {
  updateHourlyChevrons();
});

const chevronObserver = new ResizeObserver(() => {
  updateHourlyChevrons();
});

chevronObserver.observe(hourlyScroll);
```
