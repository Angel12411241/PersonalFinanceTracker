export default class BudgetManager {
  constructor(transactionManager) {
    this.budgets = this.getBudgetsFromLocalStorage() || [];
    this.transactionManager = transactionManager;
  }

  getBudgetsFromLocalStorage() {
    const budgets = JSON.parse(localStorage.getItem("budgets"));
    return budgets;
  }

  saveBudgetsToLocalStorage() {
    localStorage.setItem("budgets", JSON.stringify(this.budgets));
  }

  addBudget(budget) {
    if (this.currentlyEditing) {
      // If a budget is being edited, update it
      this.updateBudget(budget);
      this.currentlyEditing = null;
    } else {
      // Otherwise, add a new budget
      budget.id = Date.now();
      this.budgets.push(budget);
    }
    this.saveBudgetsToLocalStorage();
    this.displayBudgets();
  }

  deleteBudget(category) {
    const index = this.budgets.findIndex(
      (budget) => budget.category === category
    );
    if (index !== -1) {
      this.budgets.splice(index, 1);
    }
    this.saveBudgetsToLocalStorage();
  }
  updateBudget(updatedBudget) {
    // Find the budget with the given id and update it
    for (let budget of this.budgets) {
      if (budget.id === this.currentlyEditing) {
        budget.category = updatedBudget.category;
        budget.amount = updatedBudget.amount;
        budget.period = updatedBudget.period;
        break;
      }
    }
    this.saveBudgetsToLocalStorage();
    this.displayBudgets();
  }

  updateBudgetAmount(category, amount) {
    const budget = this.budgets.find((budget) => budget.category === category);
    if (budget) {
      budget.amount += amount;
      this.saveBudgetsToLocalStorage();
    }
  }

  updateBudgetsOnTransaction(transaction) {
    if (transaction.category !== "income") {
      this.updateBudgetAmount(transaction.category, -transaction.amount);
    }
  }

  displayBudgets() {
    // Clear existing budgets
    const budgetList = document.querySelector("#budget-list tbody");
    budgetList.innerHTML = "";

    // Iterate over budgets and add them to the HTML
    this.budgets.forEach((budget) => {
      const tr = document.createElement("tr");

      // Create cells for category, amount, period
      const categoryCell = document.createElement("td");
      categoryCell.textContent = budget.category;
      tr.appendChild(categoryCell);

      const amountCell = document.createElement("td");
      amountCell.textContent = budget.amount;
      tr.appendChild(amountCell);

      const periodCell = document.createElement("td");
      periodCell.textContent = budget.period;
      tr.appendChild(periodCell);

      // Create edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.style.marginRight = "8px";
      editButton.addEventListener("click", () => {
        // Populate the form with the budget values
        document.querySelector("#budget-category").value = budget.category;
        document.querySelector("#budget-amount").value = budget.amount;
        document.querySelector("#budget-period").value = budget.period;

        // Save the id of the budget being edited
        this.currentlyEditing = budget.id;
        this.deleteBudget(budget.id);
      });
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        this.deleteBudget(budget.id);
        this.displayBudgets();
      });

      // Append delete and edit buttons to the row
      const actionCell = document.createElement("td");
      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
      tr.appendChild(actionCell);

      // Append the row to the budget list
      budgetList.appendChild(tr);
    });
  }

  deleteBudget(id) {
    // Find the index of the budget with the given id
    const index = this.budgets.findIndex((budget) => budget.id == id);

    if (index !== -1) {
      // Remove the budget from the budgets array
      this.budgets.splice(index, 1);

      // Save the updated budgets array to localStorage
      this.saveBudgetsToLocalStorage();
    }
  }
}
