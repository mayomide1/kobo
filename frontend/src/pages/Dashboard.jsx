import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import "../css/Dashboard.css";

import { IoMdAdd } from "react-icons/io";

const api = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  async function handleGetTransactions() {
    try {
      const token = localStorage.getItem("token");

      setLoading(true);

      const response = await axios.get(`${api}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetTransactions();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const income = transactions.filter((item) => item.type === "income");
  const expenses = transactions.filter((item) => item.type === "expense");

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byExpenseCategory = transactions
  .filter((t) => t.type === "expense") 
  .reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const expenseGroupedArray = Object.entries(byExpenseCategory).map(([category, amount]) => ({
  category,
  amount,
}));
const expenseSortedCategories = [...expenseGroupedArray].sort((a, b) => b.amount - a.amount);
const expenseMaxCategoryAmount = Math.max(...expenseSortedCategories.map((c) => c.amount), 0);

  const byIncomeCategory = transactions
  .filter((t) => t.type === "income") 
  .reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const incomeGroupedArray = Object.entries(byIncomeCategory).map(([category, amount]) => ({
  category,
  amount,
}));
const incomeSortedCategories = [...incomeGroupedArray].sort((a, b) => b.amount - a.amount);
const incomeMaxCategoryAmount = Math.max(...incomeSortedCategories.map((c) => c.amount), 0);

  return (
    <div className="dash">
      <main className="dash-main">
        <header className="dash-header">
          <h2>Dashboard</h2>
          <Link to="/add-transaction" className="dash-add">
            <IoMdAdd /> Add transaction
          </Link>
        </header>

        <section className="dash-content">
          <div className="dash-stats">
            <div className="dash-card dash-stat dash-stat-balance">
              <h2>Balance</h2>
              <p>{balance === 0 ? "₦0.00" : `₦${balance.toLocaleString()}`}</p>
            </div>

            <div className="dash-card dash-stat dash-stat-income">
              <h2>Income</h2>
              <p>{totalIncome === 0 ? "₦0.00" : `₦${totalIncome.toLocaleString()}`}</p>
            </div>

            <div className="dash-card dash-stat dash-stat-expense">
              <h2>Expenses</h2>
              <p>{totalExpenses === 0 ? "₦0.00" : `₦${totalExpenses.toLocaleString()}`}</p>
            </div>
          </div>

          <div className="dash-panels">
            <div className="dash-card dash-panel">
              <div className="dash-panel-expense">
              <h3 className="dash-panel-title">Expenses by category</h3>

              <div className="dash-category-list">
                {loading && <LoadingState />}

                {!loading && !error && expenseSortedCategories.length === 0 && (
                  <EmptyState />
                )}
                {expenseSortedCategories.map((item) => (
                  <div className="dash-category " key={item.category}>
                    <div className="dash-category-row">
                      <p className="dash-category-name dash-recent-title">
                        {item.category}
                      </p>
                      <p className="dash-category-amount">
                        ₦{item.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="dash-bar">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${(item.amount / expenseMaxCategoryAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
                <div className="divider"></div>
              <div className="dash-panel-income">
              <h3 className="dash-panel-title">Income by category</h3>

              <div className="dash-category-list">
                {loading && <LoadingState />}

                {!loading && !error && incomeSortedCategories.length === 0 && (
                  <EmptyState />
                )}
                {incomeSortedCategories.map((item) => (
                  <div className="dash-category " key={item.category}>
                    <div className="dash-category-row">
                      <p className="dash-category-name dash-recent-title">
                        {item.category}
                      </p>
                      <p className="dash-category-amount">
                        ₦{item.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="dash-bar">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${(item.amount / incomeMaxCategoryAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            <div className="dash-card dash-panel">
              <h3 className="dash-panel-title">Recent transactions</h3>

              <div className="dash-recent-list">
                {loading && <LoadingState />}

                {!loading && !error && transactions.length === 0 && (
                  <EmptyState />
                )}
                {transactions.slice(0,5).map((item) => (
                  <div className="dash-recent" key={item._id}>
                    <div className="dash-recent-info">
                      <p className="dash-recent-title">
                        {item.description.charAt(0).toUpperCase() +
                          item.description.slice(1) ||
                          item.category.charAt(0).toUpperCase() +
                            item.category.slice(1)}
                      </p>
                      <p className="dash-recent-meta">
                        <span className={`dash-recent-${item.type}`}>
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}
                        </span>{" "}
                        ·{" "}
                        <span>
                          {item.category.charAt(0).toUpperCase() +
                            item.category.slice(1)}
                        </span>{" "}
                        · <span>{formatDate(item.date)}</span>
                      </p>
                    </div>
                    <p
                      className={`dash-recent-amount dash-recent-${item.type}`}
                    >
                      {item.type === "income" ? "+" : "-"}₦
                      {item.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

function EmptyState() {
  return (
    <div className="transaction-state transaction-empty">
      <h3>No transactions yet</h3>
      <Link to="/add-transaction">
        <button className="transaction-btn transaction-btn-primary">
          Add Transaction
        </button>
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="transaction-state" role="status">
      <span className="transaction-spinner" aria-hidden="true"></span>
      <p>Loading...</p>
    </div>
  );
}

export default Dashboard;
