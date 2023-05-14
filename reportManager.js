export default class ReportManager {
  constructor(transactionManager) {
    this.transactionManager = transactionManager;
    this.reportDisplay = document.querySelector("#report-display");
  }

  generateReport() {
    // Get the selected report type
    const reportType = document.querySelector("#report-type").value;

    // Get the selected date range
    const startDate = new Date(
      document.querySelector("#report-start-date").value
    );
    const endDate = new Date(document.querySelector("#report-end-date").value);

    // Clear the previous report
    this.reportDisplay.innerHTML = "";

    if (reportType === "income-vs-expense") {
      this.generateIncomeVsExpenseReport(startDate, endDate);
    }
    // You can add other report types here as needed
  }

  generateIncomeVsExpenseReport(startDate, endDate) {
    let income = 0;
    let expenses = 0;

    // Iterate over all transactions
    for (let transaction of this.transactionManager.transactions) {
      const transactionDate = new Date(transaction.date);

      // Only include transactions within the selected date range
      if (transactionDate >= startDate && transactionDate <= endDate) {
        if (transaction.category === "income") {
          income += transaction.amount;
        } else {
          expenses += transaction.amount;
        }
      }
    }

    // Create and display the report
    const report = document.createElement("p");
    report.textContent = `Income: ${income}, Expenses: ${expenses}`;
    this.reportDisplay.appendChild(report);
  }
}
