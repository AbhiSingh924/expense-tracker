// Initialize budgets and expenses
let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
let expenses = JSON.parse(localStorage.getItem("expenses")) || {};

// Initialize the budget chart
let budgetChartCtx = document.getElementById("budgetChart")?.getContext("2d");
let budgetChart = budgetChartCtx ? new Chart(budgetChartCtx, {
    type: "line",
    data: {
        labels: Object.keys(budgets),
        datasets: [
            {
                label: "Budget",
                data: Object.values(budgets),
                backgroundColor: "blue",
            },
            {
                label: "Expense",
                data: Object.values(expenses),
                backgroundColor: "red",
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
        },
        scales: {
            y: { beginAtZero: true },
        },
    },
}) : null;

// Function to update the budget chart
function updateBudgetChart() {
    if (budgetChart) {
        budgetChart.data.labels = Object.keys(budgets);
        budgetChart.data.datasets[0].data = Object.values(budgets);
        budgetChart.data.datasets[1].data = Object.values(expenses);
        budgetChart.update();
    }
}

// Function to set a budget
function setBudget() {
    const itemName = document.getElementById("item_name").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    if (itemName && !isNaN(amount)) {
        budgets[itemName] = amount;
        expenses[itemName] = expenses[itemName] || 0;
        localStorage.setItem("budgets", JSON.stringify(budgets));
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateBudgetList();
        updateBudgetChart();
    } else {
        alert("Please enter a valid item name and amount.");
    }
}

// Update budget list in UI
function updateBudgetList() {
    const budgetList = document.getElementById("budget-items");
    budgetList.innerHTML = "";
    for (let item in budgets) {
        const listItem = document.createElement("li");
        listItem.textContent = `${item}: Budget ₹${budgets[item]}, Expense ₹${expenses[item] || 0}`;
        budgetList.appendChild(listItem);
    }
}

// Function to reset all budgets and expenses
function resetBudgets() {
    if (confirm("Are you sure you want to reset all budgets and expenses?")) {
        // Clear budgets and expenses
        budgets = {};
        expenses = {};

        // Save the cleared data to localStorage
        localStorage.setItem("budgets", JSON.stringify(budgets));
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Update the UI
        updateBudgetList();
        updateBudgetChart();

        // Notify the user
        document.getElementById("message").textContent = "All budgets and expenses have been reset.";
        document.getElementById("message").style.color = "green";
    }
}

// Event listeners
document.getElementById("setBudgetBtn")?.addEventListener("click", setBudget);
document.getElementById("resetBudgetBtn")?.addEventListener("click", resetBudgets);

window.addEventListener("load", () => {
    budgets = JSON.parse(localStorage.getItem("budgets")) || {};
    expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    updateBudgetList();
    updateBudgetChart();
});

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

