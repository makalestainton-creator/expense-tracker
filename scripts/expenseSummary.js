import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function calculateTotalExpenditure() {
  // get todays date using dayjs and display it in a readable format
  const today = dayjs();

  const dateString = today.format("D dddd, MMMM YYYY");

  const month = today.format("MMMM");

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  let dailyTotal = 0;

  let monthlyTotal = 0;

  // accumulate the daily total every time we loop through the expenses
  expenses.forEach((expense) => {
    const cost = expense.cost;

    const dateString = today.format("YYYY-MM-DD");

    const expenseDate = expense.date;

    if (expenseDate === dateString) {
      dailyTotal += cost;
    }

    // accumulate the monthly totals every time we loop through the expenses
    const month = expense.date.slice(5, 7);

    const monthString = today.format("MM");

    if (month === monthString) {
      monthlyTotal += cost;
    }
  });

  let billsExpenses = 0;
  let entertainmentExpenses = 0;
  let transportExpenses = 0;
  let shoppingExpenses = 0;
  let foodExpenses = 0;
  let healthExpenses = 0;
  let otherExpenses = 0;
  expenses.forEach((expense) => {
    if (expense.cartegory === "Food") {
      return foodExpenses++;
    } else if (expense.cartegory === "Transport") {
      return transportExpenses++;
    } else if (expense.cartegory === "Entertainment") {
      return entertainmentExpenses++;
    } else if (expense.cartegory === "Shopping") {
      return shoppingExpenses++;
    } else if (expense.cartegory === "Bills") {
      return billsExpenses++;
    } else if (expense.cartegory === "Health") {
      return healthExpenses++;
    } else if (expense.cartegory === "Other") {
      return otherExpenses++;
    }
  });

  let expenseQuantities = [
    foodExpenses,
    transportExpenses,
    entertainmentExpenses,
    shoppingExpenses,
    billsExpenses,
    healthExpenses,
    otherExpenses,
  ];

  function getFinalPercentages() {
    
    const total = expenseQuantities.reduce((a, b) => {
      return a + b;
    }, 0);

    let result = expenseQuantities.map((value) => {
      const precise = (value / total) * 100;

      return {
        floor: Math.floor(precise),
        remainder: precise % 1,
      };

    });

    let currentSum = result.reduce((sum, item) => {
      return sum + item.floor;
    },0);
    let missing = 100 - currentSum;

    const sorted = [...result].sort((a, b) => {
      return b.remainder - a.remainder;
    });
    for (let i = 0; i < missing; i++) {
      sorted[i].floor++;   
    }

    return result.map((item) => {
      return item.floor;
    });
  }

  function calculateCartegoryPercentage(index) {
    const percentages = getFinalPercentages();
    return percentages[index];
  }

  function updatePieChartUI() {
    const percentages = getFinalPercentages();
    const colors = [
      "#4caf50", // Food
      "#85bbfd", // Transport
      "#b057f8", // Entertainment
      "#f8e15d", // Shopping
      "#29669b", // Bills
      "#4ea0f1", // Health
      "#e6744b", // Other
    ];

    let cumulative = 0;
    const slices = percentages.map((pct, i) => {
      const start = cumulative;
      const end = cumulative + pct;
      cumulative = end;
      return `${colors[i]} ${start}% ${end}%`;
    });

    // Directly updating the CSS background via JS
    const chart = document.querySelector(".piechart");
    chart.style.background = `conic-gradient(${slices.join(", ")})`;
  }


  // generate the html
  const totalExpenditure = document.querySelector(".js-total-expenditure");

  totalExpenditure.innerHTML = `
    <h2>Totals</h2>
    <div class="period-total">
      <p class="period">Today (${dateString}): </p>
      <p class="cost">Ksh.${dailyTotal}</p>
      <p class="period">This month (${month}): </p>
      <p class="cost">Ksh.${monthlyTotal}</p>
    </div>
    <div class="analysis-title">
      <h3>
        <img src="../icons/analytics.png" class="analytics-icon">
        Quick Analysis
      </h3>
    </div>
    <div class="chart-container">
      <div class="piechart">
        <div class="center-label">100%</div>
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color food"></div>
          Food - ${calculateCartegoryPercentage(0)}%
        </div>
        <div class="legend-item">
          <div class="legend-color transport"></div>
          Transport - ${calculateCartegoryPercentage(1)}%
        </div>
        <div class="legend-item">
          <div class="legend-color entertainment"></div>
          Entertainment - ${calculateCartegoryPercentage(2)}%
        </div>
        <div class="legend-item">
          <div class="legend-color shopping"></div>
          Shopping - ${calculateCartegoryPercentage(3)}%
        </div>
        <div class="legend-item">
          <div class="legend-color bills"></div>
          Bills - ${(calculateCartegoryPercentage(4))}%
        </div>
        <div class="legend-item">
          <div class="legend-color health"></div>
          Health - ${(calculateCartegoryPercentage(5))}%
        </div>
        <div class="legend-item">
          <div class="legend-color other"></div>
          Other - ${(calculateCartegoryPercentage(6))}%
        </div>
      </div>
    </div>
  `;
  updatePieChartUI();
}
