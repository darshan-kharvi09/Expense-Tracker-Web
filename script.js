// Load data from localStorage
let data = JSON.parse(localStorage.getItem("expenseData"));

if (!data) {
    data = {
        budget: 0,
        expenses: []
    };
}

// Wait until HTML loads
document.addEventListener("DOMContentLoaded", updateUI);

function saveData() {
    localStorage.setItem("expenseData", JSON.stringify(data));
}

// Set Budget
function setBudget() {
    const budgetInput = document.getElementById("budgetInput");
    const value = Number(budgetInput.value);

    if (value <= 0) {
        alert("Enter valid budget");
        return;
    }

    data.budget = value;
    saveData();
    updateUI();
    budgetInput.value = "";
}

// Add Expense
function addExpense() {
    const titleInput = document.getElementById("title");
    const amountInput = document.getElementById("amount");

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);

    if (title === "" || amount <= 0) {
        alert("Enter valid expense");
        return;
    }

    data.expenses.push({
        id: Date.now(),
        title: title,
        amount: amount,
        month: new Date().getMonth()
    });

    saveData();
    updateUI();

    titleInput.value = "";
    amountInput.value = "";
}

// Edit Expense
function editExpense(id) {
    const expense = data.expenses.find(e => e.id === id);

    if (!expense) return;

    const newTitle = prompt("Edit title", expense.title);
    const newAmount = prompt("Edit amount", expense.amount);

    if (newTitle === null || newAmount === null) return;

    if (newTitle.trim() === "" || Number(newAmount) <= 0) {
        alert("Invalid input");
        return;
    }

    expense.title = newTitle.trim();
    expense.amount = Number(newAmount);

    saveData();
    updateUI();
}

// Delete Expense
function deleteExpense(id) {
    data.expenses = data.expenses.filter(e => e.id !== id);
    saveData();
    updateUI();
}

// Update UI
function updateUI() {
    const budgetEl = document.getElementById("budget");
    const expenseEl = document.getElementById("expense");
    const balanceEl = document.getElementById("balance");
    const listEl = document.getElementById("list");
    const monthlyTotalEl = document.getElementById("monthlyTotal");

    budgetEl.innerText = data.budget;

    let totalExpense = 0;
    listEl.innerHTML = "";

    data.expenses.forEach(exp => {
        totalExpense += exp.amount;

        const li = document.createElement("li");
        li.innerHTML = `
            ${exp.title} - ₹${exp.amount}
            <div>
                <button class="edit" onclick="editExpense(${exp.id})">Edit</button>
                <button onclick="deleteExpense(${exp.id})">X</button>
            </div>
        `;
        listEl.appendChild(li);
    });

    expenseEl.innerText = totalExpense;
    balanceEl.innerText = data.budget - totalExpense;

    // Monthly Summary
    const currentMonth = new Date().getMonth();
    let monthlyTotal = 0;

    data.expenses.forEach(exp => {
        if (exp.month === currentMonth) {
            monthlyTotal += exp.amount;
        }
    });

    monthlyTotalEl.innerText = monthlyTotal;
}
