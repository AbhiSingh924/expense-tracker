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

### Advanced Reporting
- Generate detailed financial reports
- Custom date range filtering
- Export reports to PDF/CSV formats

### Data Visualization
- Interactive Doughnut chart for category-wise distribution
- Line chart tracking balance history over time
- Export charts as PNG images
- Comparative analysis between budget vs actuals

### Data Export
- Full transaction history export to CSV
- Scheduled automated backups
- Cross-browser data portability

## Technology Stack

| Component        | Technology                  |
|------------------|-----------------------------|
| Frontend         | HTML5, CSS3, ES6 JavaScript |
| Data Storage     | Browser localStorage        |
| Charting         | Chart.js library            |
| Reporting        | PDFMake library             |
| Data Export      | FileSaver.js                |
| UI Framework     | Custom CSS Grid/Flexbox     |
| Version Control  | Git + GitHub                |

## File Structure

```
expense-tracker/
├── index.html         # Primary application entry point
├── main/              # Core transaction management
│   ├── main.html      # Transaction UI
│   └── script.js      # Transaction logic
├── budget/            # Budget configuration
│   ├── budget.html    # Budget interface
│   └── budget.js      # Budget calculations
├── report/            # Reporting module
│   ├── report.html    # Report dashboard
│   ├── report.js      # Report generation logic
│   └── report.css     # Print-optimized styles
├── export/            # Data export features
│   ├── export.html    # Export interface
│   ├── export.js      # Export handlers
│   └── export.css     # Export styling
├── css/
│   └── style.css      # Global styles & responsive layouts
├── assets/            # Static resources
│   ├── image.png      # Application logo
│   └── passlogo.png   # Password recovery asset
└── README.md          # Project documentation
```

## Development Practices

- Modular JavaScript architecture
- Semantic HTML5 markup
- Mobile-first responsive design
- localStorage data validation
- Error handling for invalid inputs
