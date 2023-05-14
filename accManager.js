export default class AccountManager {
  constructor() {
    this.accounts = this.getAccountsFromLocalStorage() || [];
  }

  getAccountsFromLocalStorage() {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    return accounts;
  }

  saveAccountsToLocalStorage() {
    localStorage.setItem("accounts", JSON.stringify(this.accounts));
  }

  updateAccount(updatedAccount) {
    for (let account of this.accounts) {
      if (account.name === updatedAccount.name) {
        account.type = updatedAccount.type;
        account.balance = updatedAccount.balance;
        break;
      }
    }
    this.saveAccountsToLocalStorage();
  }

  displayAccounts() {
    const accountList = document
      .getElementById("account-list")
      .getElementsByTagName("tbody")[0];
    accountList.innerHTML = "";

    for (let account of this.accounts) {
      const row = accountList.insertRow();

      const nameCell = row.insertCell(0);
      const typeCell = row.insertCell(1);
      const balanceCell = row.insertCell(2);
      const actionCell = row.insertCell(3);

      nameCell.textContent = account.name;
      typeCell.textContent = account.type;
      balanceCell.textContent = account.balance;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        this.deleteAccount(account.name);
        this.displayAccounts();
      });

      actionCell.appendChild(deleteButton);
    }
  }
  updateAccountOptions() {
    // Get the account dropdown from the transaction form
    const accountDropdown = document.getElementById("account");

    // Clear the existing options
    accountDropdown.innerHTML = "";

    // Add an option for each account
    this.accounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.name;
      option.textContent = account.name;
      accountDropdown.appendChild(option);
    });
  }
  updateAccountBalance(accountName, transactionAmount, transactionCategory) {
    // Find the account with the given name and update its balance
    this.accounts.forEach((account) => {
      if (account.name === accountName) {
        if (transactionCategory === "income") {
          // If the transaction is income, add it to the balance
          let newBalance = Number(account.balance) + Number(transactionAmount);
          account.balance = newBalance;
        } else {
          // If the transaction is an expense, check if it exceeds the balance
          let newBalance = Number(account.balance) - Number(transactionAmount);
          if (newBalance < 0) {
            alert(
              `Insufficient balance in ${account.name} to complete this transaction.`
            );
            return; // Stop the function execution here
          }
          account.balance = newBalance;
        }
      }
    });

    // Save the updated accounts array to localStorage
    this.saveAccountsToLocalStorage();

    // Update the displayed accounts
    this.displayAccounts();
  }

  addAccount(account) {
    // Add the new account to the accounts array
    this.accounts.push(account);

    // Save the updated accounts array to localStorage
    this.saveAccountsToLocalStorage();

    // Update the account options in the transaction form
    this.updateAccountOptions();
  }

  deleteAccount(accountName) {
    // Filter out the account with the given name
    this.accounts = this.accounts.filter(
      (account) => account.name !== accountName
    );

    // Save the updated accounts array to localStorage
    this.saveAccountsToLocalStorage();

    // Update the account options in the transaction form
    this.updateAccountOptions();
  }
  populateAccountSelect() {
    const accountSelect = document.getElementById("account");
    accountSelect.innerHTML = ""; // clear previous options

    // Loop through each account and create an option element for it
    this.accounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.name;
      option.text = account.name;

      // Add the option to the select element
      accountSelect.appendChild(option);
    });
  }
}
