import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/AddTransaction.css";


const api = import.meta.env.VITE_API_URL;

const CATEGORIES = {
  expense: [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
    { value: "bills", label: "Bills" },
    { value: "others", label: "Others" },
  ],
  income: [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "others", label: "Others" },
  ],
};

function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const AddTransaction = () => {
  const navigate = useNavigate();

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0].value);
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleTypeChange(newType) {
    setType(newType);
    setCategory(CATEGORIES[newType][0].value);
  }

  async function handleAddTransaction(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${api}/transaction`,
        { amount: Number(amount), description, category, date, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Transaction has been saved successfully!`)
      setTimeout(() => {navigate("/transactions")}, 1500)
      setAmount("")
      setDescription("")
      setCategory(CATEGORIES.expense[0].value)
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-transaction">
      <main className="add-transaction-main">
        <form className="add-transaction-card" onSubmit={handleAddTransaction}>
          <div className="add-transaction-top">
            <h2>Add transaction</h2>
          </div>
          
          <div className="add-transaction-toggle" role="group" aria-label="Transaction type">
            <button
              type="button"
              className={type === "expense" ? "is-active" : ""}
              aria-pressed={type === "expense"}
              onClick={() => handleTypeChange("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={type === "income" ? "is-active" : ""}
              aria-pressed={type === "income"}
              onClick={() => handleTypeChange("income")}
            >
              Income
            </button>
          </div>

          <div className="add-transaction-field">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="₦100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="add-transaction-field">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              placeholder="What was it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="add-transaction-row">
            <div className="add-transaction-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES[type].map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-transaction-field">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="add-transaction-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="add-transaction-success" role="alert">
              {success}
            </p>
          )}

          <div className="add-transaction-actions">
            <button
              type="button"
              className="add-transaction-btn add-transaction-btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-transaction-btn add-transaction-btn-submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add transaction"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTransaction;