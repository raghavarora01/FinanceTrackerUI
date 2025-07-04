# FinanceTrackerUI

This is the frontend for the Personal Finance Tracker+ web application, built using **Next.js** and **Tailwind CSS**. It allows users to manage their daily expenses, set monthly budgets, visualize their spending habits, and receive smart budget suggestions.

## Features

- User authentication (login/register)
- Add, edit, and delete expenses
- Filter and search expenses by category, date, and payment method
- Set monthly budgets for each category
- Budget usage alerts (80% and 100%)
- Dashboard with:
  - Total monthly spending
  - Top spending category
  - Top 3 payment methods
  - Pie chart for category-wise spending
  - Line graph for spending trends
- Smart suggestions (via Python API)
- Fully responsive design

## Technologies Used

- **Next.js** (App Router)
- **Tailwind CSS**
- **Chart.js** (via `react-chartjs-2`)
- **Axios** for API communication
- **React Hook Form + Zod** for form handling and validation

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/raghavarora01/FinanceTrackerUI.git
cd FinanceTrackerUI
