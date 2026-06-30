import { useEffect, useState } from "react";
import API from "../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Transactions could not be loaded.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description);
    setEditType(transaction.type);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditDescription("");
    setEditType("");
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/transactions/${id}`, {
        amount: Number(editAmount),
        description: editDescription,
        type: editType,
      });

      alert("Transaction updated successfully");

      cancelEdit();
      fetchTransactions();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Transaction could not be updated.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      alert("Transaction deleted successfully");
      fetchTransactions();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Transaction could not be deleted.");
    }
  };

  return (
    <div>
      <h1>Transactions</h1>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {editingId === transaction.id ? (
                <div>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />

                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>

                  <button onClick={() => handleUpdate(transaction.id)}>
                    Save
                  </button>

                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{transaction.type}</strong> -{" "}
                  {transaction.description} - £{transaction.amount}

                  <button onClick={() => startEdit(transaction)}>Edit</button>

                  <button onClick={() => handleDelete(transaction.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;