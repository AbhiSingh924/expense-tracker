document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("report-month");
  const outputDiv = document.getElementById("report-output");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Populate month dropdown
  months.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });

  function generateReport(month) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const filtered = transactions.filter(t => {
      const txMonth = new Date(t.date).toLocaleString("default", { month: "long" });
      return txMonth === month;
    });

    let income = 0, expense = 0;
    filtered.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    outputDiv.innerHTML = `
      <div id="report-content">
        <h3>Report for ${month}</h3>
        <div><strong>Income:</strong> ₹${income.toFixed(2)}</div>
        <div><strong>Expenses:</strong> ₹${expense.toFixed(2)}</div>
        <div><strong>Net Balance:</strong> ₹${(income - expense).toFixed(2)}</div>
        <div><strong>Transaction Count:</strong> ${filtered.length}</div>
      </div>
    `;
  }

  monthSelect.addEventListener("change", () => {
    generateReport(monthSelect.value);
  });

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  monthSelect.value = currentMonth;
  generateReport(currentMonth);

  // PDF download function for selected month
  function downloadSelectedMonthTransactionsPDF() {
    const selectedMonth = document.getElementById("report-month").value;
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const filtered = transactions.filter(t => {
      const txMonth = new Date(t.date).toLocaleString("default", { month: "long" });
      return txMonth === selectedMonth;
    });

    if (filtered.length === 0) {
      alert(`No transactions found for ${selectedMonth}.`);
      return;
    }

    let income = 0, expense = 0;
    filtered.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    const container = document.createElement("div");
    container.id = "month-transactions-report";
    container.style.padding = "20px";
    container.innerHTML = `
      <h2 style="text-align:center;">${selectedMonth} Transactions Report</h2>
      <p><strong>Income:</strong> ₹${income.toFixed(2)}</p>
      <p><strong>Expenses:</strong> ₹${expense.toFixed(2)}</p>
      <p><strong>Net Balance:</strong> ₹${(income - expense).toFixed(2)}</p>
      <p><strong>Transaction Count:</strong> ${filtered.length}</p>

      <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Type</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(t => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${t.date}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${t.type}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">₹${t.amount}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${t.description || ''}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    const opt = {
      margin: 0.5,
      filename: `MoneyFlow_${selectedMonth}_Transactions.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(container).set(opt).save();
  }

  // Add the download button
  const downloadMonthBtn = document.createElement("button");
  downloadMonthBtn.textContent = "Download PDF";
  downloadMonthBtn.className =  "download-btn"
  downloadMonthBtn.style.marginTop = "1rem";
  downloadMonthBtn.onclick = downloadSelectedMonthTransactionsPDF;

  document.querySelector(".container").appendChild(downloadMonthBtn);
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Flag Fetch
async function getUserLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error("Failed to fetch location");

    const data = await response.json();
    const flagEl = document.getElementById('flag');

    if (data.country_code) {
      flagEl.src = `https://flagcdn.com/40x30/${data.country_code.toLowerCase()}.png`;
      flagEl.style.display = "inline";
    } else {
      flagEl.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    document.getElementById('flag').style.display = "none";
  }
}

getUserLocation();
