document.addEventListener("DOMContentLoaded", function () {
  const monthContainer = document.getElementById("month-container");

  const sortSelect = document.createElement("select");
  sortSelect.innerHTML = `
    <option value="default">Sort By</option>
    <option value="year">Year</option>
    <option value="income">Income</option>
  `;
  sortSelect.style.margin = "2rem auto";
  sortSelect.style.display = "block";
  sortSelect.style.fontSize = "1.2rem"; // Increase font size
  sortSelect.style.padding = "10px"; // Add padding for larger clickable area
  sortSelect.style.width = "200px"; // Set a larger width
  sortSelect.style.borderRadius = "8px"; // Add rounded corners
  sortSelect.style.border = "1px solid #ccc"; // Add a border for better visibility
  monthContainer.before(sortSelect);

  let data = getSyncedData();
  let recentlyDeleted = null;

  function getSyncedData() {
    const allTx = JSON.parse(localStorage.getItem("transactions")) || [];
    const grouped = {};

    allTx.forEach(t => {
      const date = new Date(t.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const key = `${month} ${year}`;

      if (!grouped[key]) {
        grouped[key] = {
          key,
          month,
          year,
          income: 0,
          expense: 0
        };
      }

      const amt = parseFloat(t.amount);
      if (t.type === "income") {
        grouped[key].income += amt;
      } else {
        grouped[key].expense += amt;
      }
    });

    return Object.values(grouped).map(entry => {
      entry.remaining = entry.income - entry.expense;
      entry.needs = entry.income * 0.5;
      entry.work = entry.income * 0.3;
      entry.savings = entry.income * 0.2;
      return entry;
    });
  }

  function renderMonths() {
    monthContainer.innerHTML = "";

    data.forEach((entry, index) => {
      let remainingExpense = entry.expense;
      let needUsed = Math.min(entry.needs, remainingExpense); remainingExpense -= needUsed;
      let workUsed = Math.min(entry.work, remainingExpense); remainingExpense -= workUsed;
      let savingUsed = Math.min(entry.savings, remainingExpense); remainingExpense -= savingUsed;

      const needRem = entry.needs - needUsed;
      const workRem = entry.work - workUsed;
      const savingRem = entry.savings - savingUsed;

      const card = document.createElement("div");
      card.className = "card";
      
    let alertMsg = "";
    if (needUsed > entry.needs) alertMsg += "<p style='color:orange;'>⚠️ Overspent Needs Budget</p>";
    if (workUsed > entry.work) alertMsg += "<p style='color:orange;'>⚠️ Overspent Work Budget</p>";
    if (savingUsed > entry.savings) alertMsg += "<p style='color:orange;'>⚠️ Overspent Savings Budget</p>";

    card.innerHTML = alertMsg + `

        <h3>${entry.month} ${entry.year}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; color: white;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #444;">Category</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #444;">Allocated</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #444;">Spent</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #444;">Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px;">Needs</td>
              <td style="padding: 8px;">₹${entry.needs.toFixed(2)}</td>
              <td style="padding: 8px;">₹${needUsed.toFixed(2)}</td>
              <td style="padding: 8px;">₹${needRem.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Work</td>
              <td style="padding: 8px;">₹${entry.work.toFixed(2)}</td>
              <td style="padding: 8px;">₹${workUsed.toFixed(2)}</td>
              <td style="padding: 8px;">₹${workRem.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Savings</td>
              <td style="padding: 8px;">₹${entry.savings.toFixed(2)}</td>
              <td style="padding: 8px;">₹${savingUsed.toFixed(2)}</td>
              <td style="padding: 8px;">₹${savingRem.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <button class="delete-month-btn" data-index="${index}" style="margin-top:10px; background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">Delete</button>
      `;
      monthContainer.appendChild(card);
    });

    document.querySelectorAll(".delete-month-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.dataset.index);
        const entry = data[idx];

        if (confirm(`Are you sure you want to delete ${entry.month} ${entry.year}?`)) {
          recentlyDeleted = { ...entry, index: idx };
          data.splice(idx, 1);
          renderMonths();
          showUndoButton();
        }
      });
    });
  }

  function showUndoButton() {
    const undoBtn = document.createElement("button");
    undoBtn.innerText = "Undo Delete";
    Object.assign(undoBtn.style, {
      background: "#28a745",
      color: "white",
      border: "none",
      padding: "10px",
      margin: "10px auto",
      display: "block",
      borderRadius: "5px",
      cursor: "pointer"
    });

    undoBtn.onclick = () => {
      if (recentlyDeleted) {
        data.splice(recentlyDeleted.index, 0, recentlyDeleted);
        recentlyDeleted = null;
        renderMonths();
        undoBtn.remove();
      }
    };

    monthContainer.before(undoBtn);
  }

  sortSelect.addEventListener("change", () => {
    const val = sortSelect.value;
    if (val === "year") {
      data.sort((a, b) => a.year - b.year);
    } else if (val === "income") {
      data.sort((a, b) => b.income - a.income);
    }
    renderMonths();
  });

  renderMonths();
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

async function getUserLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (data.country_code) {
      const flagEl = document.getElementById("flag");
      flagEl.src = `https://flagcdn.com/40x30/${data.country_code.toLowerCase()}.png`;
      flagEl.style.display = "inline";
    }
  } catch (e) {
    document.getElementById("flag").style.display = "none";
  }
}
getUserLocation();
