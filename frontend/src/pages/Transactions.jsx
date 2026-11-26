import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../css/Transactions.css";

import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const api = import.meta.env.VITE_API_URL;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

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

  async function handleDeleteTransaction(id) {
    setError("");
    if (!window.confirm("Permanently delete this transaction")) return;
    try {
      await axios.delete(`${api}/delete-transaction/${id}`);
      handleGetTransactions();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      setError(backendMessage);
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
  const query = search.trim().toLowerCase();
  const filteredTransactions = transactions.filter((t) =>
    `${t.description || ""}`.toLowerCase().includes(query),
  );

  return (
    <div className="transaction">
      <main className="transaction-main">
        <header className="transaction-header">
          <h2>Transactions</h2>

          <Link to="/add-transaction" className="transaction-add">
            <IoMdAdd /> Add transaction
          </Link>
        </header>

        {/* Search */}
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <input
              type="search"
              placeholder="Search description"
              aria-label="Search transactions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IoMdSearch
              className="transaction-search-icon"
              aria-hidden="true"
            />
          </div>
        </div>

        <section className="transaction-content">
          <div className="transaction-table-wrapper">
            {loading && (
              <div className="transaction-state" role="status">
                <span className="transaction-spinner" aria-hidden="true"></span>
                <p>Loading...</p>
              </div>
            )}

            {error && (
              <div className="transaction-state">
                <p className="transaction-error" role="alert">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && transactions.length === 0 && (
              <div className="transaction-state transaction-empty">
                <h3>No transactions yet</h3>
                <p>
                  Start tracking your income and expenses by adding your first
                  transaction.
                </p>
                <Link to="/add-transaction">
                  <button className="transaction-btn transaction-btn-primary">
                    Add Transaction
                  </button>
                </Link>
              </div>
            )}

            {!loading &&
              !error &&
              transactions.length > 0 &&
              filteredTransactions.length === 0 && (
                <div className="transaction-state">
                  <p>No transactions match “{search}”.</p>
                </div>
              )}

            {!loading && !error && filteredTransactions.length > 0 && (
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="transaction-date" data-label="Date">
                        <span>{formatDate(transaction.date)}</span>
                      </td>
                      <td
                        className={`transaction-description ${
                          transaction.description
                            ? ""
                            : "transaction-description-empty"
                        }`}
                        data-label="Description"
                      >
                        <span>
                          {transaction.description ||
                            transaction.category.charAt(0).toUpperCase() +
                              transaction.category.slice(1)}
                        </span>
                      </td>
                      <td
                        className="transaction-category"
                        data-label="Category"
                      >
                        <span>{transaction.category}</span>
                      </td>
                      <td
                        className={`transaction-amount transaction-amount-${transaction.type}`}
                      >
                        ₦{transaction.amount.toLocaleString()}
                      </td>
                      <td className="transaction-actions-cell">
                        <div className="transaction-actions">
                          {/* <button
                            className="transaction-btn transaction-btn-edit"
                            aria-label="Edit transaction"
                          >
                            <FaEdit />
                            <span className="transaction-btn-text">Edit</span>
                          </button> */}
                          <button
                            className="transaction-btn transaction-btn-delete"
                            aria-label="Delete transaction"
                          >
                            <MdDelete />
                            <span
                              className="transaction-btn-text"
                              onClick={() =>
                                handleDeleteTransaction(transaction._id)
                              }
                            >
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Transactions;
