import AccountManager from "./accManager.js";
export default class TransactionManager {
  constructor(accountManager) {
    this.transactions = this.getTransactionsFromLocalStorage() || [];
    this.accountManager = accountManager;
  }

  getTransactionsFromLocalStorage() {
    const transactions = JSON.parse(localStorage.getItem("transactions"));
    return transactions;
  }

  saveTransactionsToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  addTransaction(transaction, accountManager) {
    // Check if transaction is an expense and if there is enough balance

    const account = accountManager.accounts.find(
      (account) => account.name === transaction.account
    );
    if (account && Number(account.balance) < Number(transaction.amount)) {
      alert(
        `Insufficient balance in ${account.name} to complete this transaction.`
      );
      return; // Do not add transaction
    }

    this.transactions.push(transaction);

    accountManager.updateAccountBalance(
      transaction.account,
      transaction.amount,
      transaction.category
    );
    this.saveTransactionsToLocalStorage();
  }

  deleteTransaction(transactionId) {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id == transactionId
    );
    const transaction = this.transactions[index];

    const amount =
      transaction.category === "income"
        ? +transaction.amount
        : -transaction.amount;
    this.accountManager.updateAccountBalance(transaction.account, amount);
    this.transactions.splice(index, 1);

    this.saveTransactionsToLocalStorage();
  }

  updateTransaction(updatedTransaction) {
    for (let transaction of this.transactions) {
      if (transaction.id === updatedTransaction.id) {
        transaction.date = updatedTransaction.date;
        transaction.account = updatedTransaction.account;
        transaction.category = updatedTransaction.category;
        transaction.description = updatedTransaction.description;
        transaction.amount = updatedTransaction.amount;
        break;
      }
    }

    // Save the updated transactions array to localStorage
    this.saveTransactionsToLocalStorage();
  }

  editTransaction(id) {
    let transaction = this.transactions.find(
      (transaction) => transaction.id == id
    );
    if (transaction) {
      document.getElementById("date").value = transaction.date;
      document.getElementById("account").value = transaction.account;
      document.getElementById("category").value = transaction.category;
      document.getElementById("description").value = transaction.description;
      document.getElementById("amount").value = transaction.amount;
      document.getElementById("transaction-form").setAttribute("data-id", id);
    }
    this.deleteTransaction(id);
  }
  getTransactions() {
    // Return a copy of the transactions array
    return [...this.transactions];
  }
}

// Create an instance of TransactionManager
const transactionManager = new TransactionManager();
