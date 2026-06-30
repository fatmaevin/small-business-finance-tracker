import { useEffect, useState } from "react";
import API from "../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

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
              <strong>{transaction.type}</strong> - {transaction.description} - £
              {transaction.amount}

              <button onClick={() => handleDelete(transaction.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;