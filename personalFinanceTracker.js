export default class PersonalFinanceTracker {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
  }
  static html() {}
  static transaction() {}
  load() {}
  updateUI() {}
  saveToLocal() {}
  addTransaction(transaction = {}) {}
  getTransaction() {}
  onNewTransacitonBtnClick() {}
}
