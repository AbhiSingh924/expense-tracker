
document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("report-month");
  const outputDiv = document.getElementById("report-output");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Populate dropdown
  months.forEach((m, idx) => {
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
      <button id="download-pdf">Download PDF</button>
    `;

    document.getElementById("download-pdf").addEventListener("click", function () {
      const content = document.getElementById("report-content");
      const opt = {
        margin:       1,
        filename:     `MoneyFlow_Report_${month}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(content).set(opt).save();
    });
  }

  monthSelect.addEventListener("change", () => {
    generateReport(monthSelect.value);
  });

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  monthSelect.value = currentMonth;
  generateReport(currentMonth);
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
