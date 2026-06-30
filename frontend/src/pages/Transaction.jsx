import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import TransactionFilters from "../components/TransactionFilters";
import TransactionTable from "../components/TransactionTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editTransactionDate, setEditTransactionDate] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const transactionDate = transaction.transaction_date?.split("T")[0];
    const matchesDate = dateFilter === "" || transactionDate === dateFilter;

    return matchesSearch && matchesDate;
  });

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description);
    setEditType(transaction.type);
    setEditTransactionDate(transaction.transaction_date?.split("T")[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditDescription("");
    setEditType("");
    setEditTransactionDate("");
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/transactions/${id}`, {
        amount: Number(editAmount),
        description: editDescription,
        type: editType,
        transaction_date: editTransactionDate,
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
      <Navbar />

      <h1>Transactions</h1>

      <TransactionFilters
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <TransactionTable
        transactions={filteredTransactions}
        editingId={editingId}
        editAmount={editAmount}
        setEditAmount={setEditAmount}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editType={editType}
        setEditType={setEditType}
        editTransactionDate={editTransactionDate}
        setEditTransactionDate={setEditTransactionDate}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Transactions;