const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const totalDisplay = document.getElementById("total");
const expenseList = document.getElementById("expense-list");

let expenses = [];

try {
    const savedExpenses = JSON.parse(
        localStorage.getItem("my-expenses") || "[]"
    );

    if (Array.isArray(savedExpenses)) {
        expenses = savedExpenses.filter(item =>
            item &&
            typeof item.name === "string" &&
            typeof item.amount === "number" &&
            Number.isFinite(item.amount) &&
            item.amount > 0 &&
            typeof item.category === "string"
        );
    }
} catch {
    expenses = [];
}

function saveExpenses() {
    try {
        localStorage.setItem("my-expenses", JSON.stringify(expenses));
    } catch {
        alert("Unable to save data in this browser.");
    }
}

function renderExpenses() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    totalDisplay.textContent = total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });

    expenseList.replaceChildren();

    if (expenses.length === 0) {
        const message = document.createElement("p");
        message.className = "empty";
        message.textContent = "No expenses yet. Add your first one!";
        expenseList.appendChild(message);
        return;
    }

    expenses.forEach(expense => {
        const item = document.createElement("div");
        item.className = "expense-item";

        const info = document.createElement("div");
        info.className = "expense-info";

        const title = document.createElement("h3");
        title.textContent = expense.name;

        const details = document.createElement("p");
        details.textContent = expense.category + " · " + expense.date;

        info.append(title, details);

        const right = document.createElement("div");
        right.className = "expense-right";

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = "₹" + expense.amount.toLocaleString("en-IN");

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + expense.name);

        deleteButton.addEventListener("click", () => {
            expenses = expenses.filter(entry => entry.id !== expense.id);
            saveExpenses();
            renderExpenses();
        });

        right.append(amount, deleteButton);
        item.append(info, right);
        expenseList.appendChild(item);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    expenses.unshift({
        id: Date.now() + Math.random(),
        name: name,
        amount: amount,
        category: categoryInput.value,
        date: new Date().toLocaleDateString("en-IN")
    });

    saveExpenses();
    renderExpenses();
    form.reset();
    nameInput.focus();
});

renderExpenses();