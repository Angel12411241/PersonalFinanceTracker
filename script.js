import TransactionManager from "./transactionManager.js";
import AccountManager from "./accManager.js";
import BudgetManager from "./budget.js";
import ReportManager from "./reportManager.js";
import DashboardManager from "./DashboardManager.js";
let accountManager = new AccountManager();
const transactionManager = new TransactionManager(accountManager);
const budgetManager = new BudgetManager(transactionManager);
const reportManager = new ReportManager(transactionManager);
const dashboardManager = new DashboardManager(transactionManager);
const dateInput = document.getElementById("date");
const accountInput = document.getElementById("account");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const accountForm = document.getElementById("account-form");
accountManager.displayAccounts();
accountManager.populateAccountSelect();
budgetManager.displayBudgets();
reportManager.generateReport();
dashboardManager.displayIncomeExpenseChart();
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Create a new transaction object
  const newTransaction = {
    id: Date.now(), // Generate a unique id based on the current timestamp
    date: dateInput.value,
    account: accountInput.value,
    category: categoryInput.value,
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
  };

  const accountObj = accountManager.accounts.find(
    (acc) => acc.name == newTransaction.account
  );
  if (
    accountObj &&
    Number(accountObj.balance) < Number(newTransaction.amount)
  ) {
    alert(
      `Insufficient balance in ${accountObj.name} to complete this transaction.`
    );
    return;
  } else {
    transactionManager.addTransaction(newTransaction, accountManager);
    budgetManager.updateBudgetsOnTransaction(newTransaction);
    budgetManager.displayBudgets();
    renderTransactions();
    reportManager.generateReport();
    dashboardManager.displayIncomeExpenseChart();
    dateInput.value = "";
    accountInput.value = "";
    categoryInput.value = "";
    descriptionInput.value = "";
    amountInput.value = "";
  }
});

function generateTransactionHTML(transaction) {
  return `
      <tr>
          <td>${transaction.date}</td>
          <td>${transaction.account}</td>
          <td>${transaction.category}</td>
          <td>${transaction.description}</td>
          <td>${transaction.amount.toFixed(2)}</td>
          <td>
              <button class="edit-button" data-id="${
                transaction.id
              }">Edit</button>
              <button class="delete-button" data-id="${
                transaction.id
              }">Delete</button>
          </td>
      </tr>
  `;
}

function renderTransactions() {
  const transactionList = document.getElementById("transaction-list");

  const transactions = transactionManager.getTransactions();

  const transactionHTML = transactions.map(generateTransactionHTML).join("");

  transactionList.innerHTML = transactionHTML;
}

transactionList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    let id = event.target.getAttribute("data-id");

    transactionManager.deleteTransaction(id);
    dashboardManager.displayIncomeExpenseChart();
    renderTransactions();
  }
});
// Add event listeners to the edit buttons
let editButtons = document.querySelectorAll(".edit-button");
for (let i = 0; i < editButtons.length; i++) {
  editButtons[i].addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    transactionManager.editTransaction(id);
    reportManager.generateReport();
    dashboardManager.displayIncomeExpenseChart();
  });
}
transactionList.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-button")) {
    let id = event.target.getAttribute("data-id");
    transactionManager.editTransaction(id);
    reportManager.generateReport();
    dashboardManager.displayIncomeExpenseChart();
    renderTransactions();
  }
});
accountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const accountName = document.getElementById("account-name").value;
  const accountType = document.getElementById("account-type").value;
  const initialBalance = document.getElementById("initial-balance").value;

  const newAccount = {
    name: accountName,
    type: accountType,
    balance: initialBalance,
  };

  accountManager.addAccount(newAccount);

  accountForm.reset();

  accountManager.updateAccountOptions();
  accountManager.displayAccounts();
});
document.getElementById("budget-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const category = document.getElementById("budget-category").value;
  const amount = document.getElementById("budget-amount").value;
  const period = document.getElementById("budget-period").value;

  const budget = {
    category: category,
    amount: parseFloat(amount),
    period: period,
  };
  document.getElementById("budget-form").reset();
  budgetManager.addBudget(budget);
  budgetManager.displayBudgets();
});
document.querySelector("#generate-report").addEventListener("click", () => {
  reportManager.generateReport();
});
renderTransactions();
