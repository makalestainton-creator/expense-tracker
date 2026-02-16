export function renderExpenseChart() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let expenseChart = null;
  const categoryTotals = {
    food: 0,
    transport: 0,
    entertainment: 0,
    shopping: 0,
    bills: 0,
    health: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    const category = expense.cartegory.toLowerCase();
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += expense.cost;
    }
  });

  let categoryValues = [];
  for (const category in categoryTotals) {
    const value = categoryTotals[category];
    if (value === 0) {
      categoryValues.push(value);
    }
  }
  if (categoryValues.length === 7) {
    return;
  }

  const data = {
    labels: [
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Health",
      "Other",
    ],
    datasets: [
      {
        label: "Cartegory",
        data: [
          categoryTotals["food"],
          categoryTotals["transport"],
          categoryTotals["entertainment"],
          categoryTotals["shopping"],
          categoryTotals["bills"],
          categoryTotals["other"],
        ],
        backgroundColor: [
          "#4ADE80",
          "#60A5FA",
          "#b057f8",
          "#f8e15d",
          "#29669b",
          "#4ea0f1",
          "#e6744b",
        ],
        hoverOffset: 2,
        borderWidth: 2,
        // borderColor: isDarkMode ? "#031922" : "#fff",
      },
    ],
  };

  // expenseChart = new Chart(ctx.getContext("2d"), {
  //   type: "doughnut",
  //   data: {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: "Amount Spent (Ksh)",
  //         data: data,
  //         backgroundColor: [
  //           "#4ADE80", // Food
  //           "#60A5FA", // Transport
  //           "#b057f8", // Entertainment
  //           "#f8e15d", // Shopping
  //           "#29669b", // Bills
  //           "#4ea0f1", // Health
  //           "#e6744b", // Other
  //         ],
  //         borderWidth: 3,
  //         borderColor: isDarkMode ? "#031922" : "#fff",
  //         hoverOffset: 10,
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: true,
  //     plugins: {
  //       legend: {
  //         position: "bottom", // ← This moves legend to bottom
  //         labels: {
  //           padding: 20,
  //           font: {
  //             size: 12,
  //             family: "Roboto",
  //           },
  //           color: isDarkMode ? "#cccbcb" : "#1f2937",
  //           usePointStyle: true,
  //           pointStyle: "circle",
  //         },
  //       },
  //       title: {
  //         display: true,
  //         text: "Spending by Category",
  //         font: {
  //           size: 18,
  //           weight: "500",
  //           family: "Roboto",
  //         },
  //         color: isDarkMode ? "#d6d6d6" : "#1f2937",
  //         padding: {
  //           top: 10,
  //           bottom: 20,
  //         },
  //       },
  //       tooltip: {
  //         callbacks: {
  //           label: function (context) {
  //             let label = context.label || "";
  //             if (label) {
  //               label += ": ";
  //             }
  //             label += "Ksh " + context.parsed.toLocaleString();

  //             const total = context.dataset.data.reduce((a, b) => a + b, 0);
  //             const percentage = ((context.parsed / total) * 100).toFixed(1);
  //             label += ` (${percentage}%)`;

  //             return label;
  //           },
  //         },
  //         backgroundColor: isDarkMode
  //           ? "rgba(0, 0, 0, 0.9)"
  //           : "rgba(0, 0, 0, 0.8)",
  //         padding: 12,
  //         cornerRadius: 8,
  //         titleFont: {
  //           size: 14,
  //         },
  //         bodyFont: {
  //           size: 13,
  //         },
  //       },
  //     },
  //   },
  // });

  const ctx = document.getElementById("doughnutCanvas");
  const existingChart = Chart.getChart("doughnutCanvas");
  if (existingChart) {
    existingChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "right", // ← This moves legend to bottom
          labels: {
            padding: 20,
            font: {
              size: 12,
              family: "Roboto",
            },
            // color: isDarkMode ? "#cccbcb" : "#1f2937",
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: true,
          text: "Spending by Category",
          font: {
            size: 18,
            weight: "500",
            family: "Roboto",
          },
          // color: isDarkMode ? "#d6d6d6" : "#1f2937",
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              label += "Ksh " + context.parsed.toLocaleString();

              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              label += ` (${percentage}%)`;

              return label;
            },
          },
          // backgroundColor: isDarkMode
          //   ? "rgba(0, 0, 0, 0.9)"
          //   : "rgba(0, 0, 0, 0.8)",
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
        },
      },
    },
    maxHeight: 250
  });
}
