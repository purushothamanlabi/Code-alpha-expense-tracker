function validateExpenseInput(input) {
  input.value = input.value.replace(/[^A-Za-z]/g, "");
}

document.addEventListener("DOMContentLoaded", function () {
  const expenseInput = document.getElementById("expense");
  const amountInput = document.getElementById("amount");
  const addExpenseBtn = document.getElementById("addExpense");
  const expenseTableBody = document.getElementById("expenseTableBody");
  const totalExpenseCell = document.getElementById("totalExpense");
  let editIndex = -1;
 
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  expenses.forEach(function (expense) {
    renderExpense(expense);
  });

  function renderExpense(expense) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${expense.description}</td>
            <td> \u20B9 ${expense.amount}</td>
            <td><button class="edit">Edit</button></td>
            <td><button class="delete">Delete</button></td>
        `;
    expenseTableBody.appendChild(tr);
    updateTotalExpense();
  }

  addExpenseBtn.addEventListener("click", function () {
    const description = expenseInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (description !== "" && !isNaN(amount)) {
      if (editIndex !== -1) {
        expenses[editIndex].description = description;
        expenses[editIndex].amount = amount;
        const row = expenseTableBody.childNodes[editIndex];
        row.innerHTML = `
                    <td>${description}</td>
                    <td> \u20B9 ${amount}</td>
                    <td><button class="edit">Edit</button></td>
                    <td><button class="delete">Delete</button></td>
                `;
        editIndex = -1;
      } else {
        const expense = { description, amount };
        expenses.push(expense);
        renderExpense(expense);
      }
      saveExpenses();
      updateTotalExpense();
      expenseInput.value = "";
      amountInput.value = "";
    }
  });

  expenseTableBody.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("edit")) {
      const row = target.parentNode.parentNode;
      const index = Array.from(row.parentNode.children).indexOf(row);
      editIndex = index;
      expenseInput.value = expenses[index].description;
      amountInput.value = expenses[index].amount;
    } else if (target.classList.contains("delete")) {
      const row = target.parentNode.parentNode;
      const index = Array.from(row.parentNode.children).indexOf(row);
      expenses.splice(index, 1);
      row.remove();
      saveExpenses();
    }
    updateTotalExpense();
  });

  function updateTotalExpense() {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalExpenseCell.textContent = `Total Expense: \u20B9 ${total.toFixed(2)}`;
  }

  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
});
