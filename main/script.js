const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const budgetAlertEl = document.getElementById("budget-alert");
const sortSelect = document.getElementById("sort");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateSummary() {
    let income = 0, expense = 0, balance = 0;

    transactions.forEach(t => {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    balance = income - expense;

    balanceEl.innerText = balance.toFixed(2);
    incomeEl.innerText = "₹" + income.toFixed(2);
    expenseEl.innerText = "₹" + expense.toFixed(2);
}

function renderTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((t, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span style="color: ${t.type === "income" ? "#90ee90" : "#ff6666"}">
                            ${t.description}: ₹${t.amount}
                        </span> 
                        <span style="color:rgba(46, 51, 51, 0.81);">${t.date}</span>
                        <span onclick="deleteTransaction(${index})" style="cursor:pointer; color:grey;">❌</span>`;
        transactionList.appendChild(li);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateSummary();
    renderTransactions();
    updateChart();
}

transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const date = dateInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !date) {
        alert("Please enter a valid description, amount, and date.");
        return;
    }

    transactions.push({ description, amount, type, date });
    saveAndRender();

    // Clear input fields
    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
});

// ADDING BAR CHART FOR INCOME VS EXPENSE
var ctx = document.getElementById("expenseChart").getContext("2d");
var expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [0, 0],
            backgroundColor: ["#90ee90", "#ff6666"]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});



// UPDATES THE CHART WITH LATEST VALUES
function updateChart() {
    let income = 0, expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    expenseChart.data.datasets[0].data = [income, expense];
    expenseChart.update();

    const budgetAlertEl = document.getElementById("budget-alert");

    if (income >= 0 && expense > income) {
        budgetAlertEl.innerHTML = "⚠️ <b>BUDGET EXCEEDED:</b> Your expenses have crossed your income!";
        budgetAlertEl.style.color = "#ff6666";
        budgetAlertEl.style.fontWeight = "bold";
        budgetAlertEl.style.fontSize = "1.5rem";
    
    }
    else if (income > 0 && expense > income * 0.7) {
        budgetAlertEl.innerHTML = "⚠️ <b>BUDGET EXCEEDED:</b> Your expenses have crossed 70% of your income!";
        budgetAlertEl.style.color = "#f99999";
        budgetAlertEl.style.fontWeight = "bold";
        budgetAlertEl.style.fontSize = "1.5rem";
    }
    else {
        budgetAlertEl.innerHTML = "✅ <b>Budget is under control.</b>";
        budgetAlertEl.style.color = "#90ee90";
        budgetAlertEl.style.fontWeight = "bold";
        budgetAlertEl.style.fontSize = "1.2rem";
    }

    
}

// SORT TRANSACTIONS BASED ON SELECTED OPTION
sortSelect.addEventListener("change", function () {
    const sortBy = this.value;

    if (sortBy === "date") {
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "amount") {
        transactions.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "type") {
        transactions.sort((a, b) => a.type.localeCompare(b.type));
    }

    renderTransactions();
});


saveAndRender();

 // Dark Mode Toggle
 const themeToggle = document.getElementById('theme-toggle');
 themeToggle.addEventListener('click', () => {
   document.documentElement.classList.toggle('dark');
 });

 // Fetch User Location and Display Flag
async function getUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error("Failed to fetch location");
        
        const data = await response.json();
        const countryNameEl = document.getElementById('country-name');
        const flagEl = document.getElementById('flag');


        // Ensure country_code is valid before setting the flag
        if (data.country_code) {
            flagEl.src = `https://flagcdn.com/40x30/${data.country_code.toLowerCase()}.png`;
            flagEl.style.display = "inline"; // Ensure flag is visible
        } else {
            flagEl.style.display = "none";
            console.error("Country code missing from API response.");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        document.getElementById('flag').style.display = "none";
    }
}

// Run function on page load
getUserLocation();

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("show");
}

