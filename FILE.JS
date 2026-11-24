
var nameInput = document.getElementById("expenseName");
var amountInput = document.getElementById("expenseAmount");
var categoryInput = document.getElementById("expenseCategory");
var addBtn = document.getElementById("addBtn");
var filterSelect = document.getElementById("filterCategory");
var errorMessage = document.getElementById("errorMessage");
var expenseList = document.getElementById("expenseList");
var emptyMessage = document.getElementById("emptyMessage");
var totalAmount = document.getElementById("totalAmount");

var expenses = [];

var saved = localStorage.getItem("studentExpenses");
if (saved) {
  expenses = JSON.parse(saved);
}

function saveExpenses() {
  localStorage.setItem("studentExpenses", JSON.stringify(expenses));
}

function showExpenses() {
  var selected = filterSelect.value;
  var total = 0;
  var count = 0;

  expenseList.innerHTML = "";

  for (var i = 0; i < expenses.length; i++) {
    var exp = expenses[i];

    if (selected !== "All" && exp.category !== selected) {
      continue;
    }

    count++;
    total = total + exp.amount;

    var li = document.createElement("li");

    var info = document.createElement("div");
    info.className = "expense-info";

    var nameLine = document.createElement("strong");
    nameLine.textContent = exp.name;

    var detailLine = document.createElement("div");
    detailLine.textContent = exp.category + " - ₹" + exp.amount.toFixed(2);

    info.appendChild(nameLine);
    info.appendChild(detailLine);

    var delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";
    delBtn.setAttribute("data-id", exp.id);
    delBtn.addEventListener("click", function () {
      deleteExpense(Number(this.getAttribute("data-id")));
    });

    li.appendChild(info);
    li.appendChild(delBtn);
    expenseList.appendChild(li);
  }

  if (count === 0) {
    if (expenses.length === 0) {
      emptyMessage.textContent = "No expenses added yet.";
    } else {
      emptyMessage.textContent = "No expenses in this category.";
    }
  } else {
    emptyMessage.textContent = "";
  }

  totalAmount.textContent = "₹" + total.toFixed(2);
}

function addExpense() {
  var name = nameInput.value.trim();
  var amountText = amountInput.value.trim();

  // validation
  if (name === "" || amountText === "") {
    errorMessage.textContent = "Please fill in both the name and the amount.";
    return;
  }

  var amount = Number(amountText);

  if (isNaN(amount) || amount <= 0) {
    errorMessage.textContent = "Amount must be a number greater than 0.";
    return;
  }

  var newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: categoryInput.value
  };

  expenses.push(newExpense);
  saveExpenses();

  nameInput.value = "";
  amountInput.value = "";
  errorMessage.textContent = "";
  nameInput.focus();

  showExpenses();
}

function deleteExpense(id) {
  var remaining = [];
  for (var i = 0; i < expenses.length; i++) {
    if (expenses[i].id !== id) {
      remaining.push(expenses[i]);
    }
  }
  expenses = remaining;
  saveExpenses();
  showExpenses();
}

addBtn.addEventListener("click", addExpense);
filterSelect.addEventListener("change", showExpenses);

amountInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addExpense();
  }
});

showExpenses();