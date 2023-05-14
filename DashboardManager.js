export default class DashboardManager {
  constructor(transactionManager) {
    this.transactionManager = transactionManager;
    this.incomeExpenseChart = null; // Initialize chart variable
  }

  // ... rest of the code ...

  displayIncomeExpenseChart() {
    const transactions = this.transactionManager.getTransactions();

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.category === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    // Set the total income and expenses in the HTML
    document.getElementById(
      "total-income"
    ).textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById(
      "total-expenses"
    ).textContent = `$${totalExpenses.toFixed(2)}`;

    // If a chart already exists, destroy it before creating a new one
    if (this.incomeExpenseChart) {
      this.incomeExpenseChart.destroy();
    }

    const ctx = document
      .getElementById("income-expense-chart")
      .getContext("2d");

    this.incomeExpenseChart = new Chart(ctx, {
      type: "pie", // You can change this to 'bar', 'line', etc.
      data: {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            label: "Income vs Expenses",
            data: [totalIncome, totalExpenses],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)", // Color for Income
              "rgba(255, 99, 132, 0.2)", // Color for Expenses
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)", // Color for Income
              "rgba(255, 99, 132, 1)", // Color for Expenses
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
