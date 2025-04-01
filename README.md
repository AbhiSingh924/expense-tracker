# Expense Tracker Application

A comprehensive financial management solution with the following capabilities:

- **Real-time expense tracking**: Monitor income/expenses with date stamps
- **Budget visualization**: Interactive pie charts and bar graphs for spending analysis
- **Multi-category management**: Create custom categories for expenses
- **Data persistence**: Automatic saving to localStorage with browser reload protection
- **Cross-device compatibility**: Responsive design optimized for mobile/desktop

## Key Features

### Transaction Management
- Add/remove transactions with amount, description, and category
- Instant balance calculation (total income, expense, and net balance)
- Transaction history sorting by date/amount

### Budget Planning
- Set monthly budget limits per category
- Visual progress bars for budget utilization
- Historical spending pattern analysis

### Data Visualization
- Interactive Doughnut chart for category-wise distribution
- Line chart tracking balance history over time
- Export charts as PNG images

## Technology Stack

| Component        | Technology                 |
|------------------|----------------------------|
| Frontend         | HTML5, CSS3, ES6 JavaScript|
| Data Storage     | Browser localStorage       |
| Charting         | Chart.js library           |
| UI Framework     | Custom CSS Grid/Flexbox    |
| Version Control  | Git + GitHub               |



## File Structure

```
expense-tracker/
├── index.html       # Dashboard landing page
├── main.html        # Transaction management UI
├── budget.html      # Budget configuration interface
├── css/
│   ── style.css    # Global styles + responsive layouts
├── js/
│   ├── script.js    # Core logic: Transactions, localStorage
│   ── script2.js   # Chart implementations, budget calculations
├── assets/          # Static resources
│   ├── icons/       # SVG icons
│   ├── screenshots/ # Application previews
│   ── favicon.ico  
── README.md        # Project documentation
```

## Development Practices

- Modular JavaScript architecture
- Semantic HTML5 markup
- Mobile-first responsive design
- localStorage data validation
- Error handling for invalid inputs



