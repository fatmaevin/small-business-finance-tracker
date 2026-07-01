import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import TransactionFilters from "../components/TransactionFilters";
import TransactionTable from "../components/TransactionTable";
import toast from "react-hot-toast";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTransactionDate, setEditTransactionDate] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      toast.error("Transactions could not be loaded.");
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

    const matchesMethod =
      methodFilter === "" || transaction.payment_method === methodFilter;

    const matchesCategory =
      categoryFilter === "" || transaction.category === categoryFilter;

    return matchesSearch && matchesDate && matchesMethod && matchesCategory;
  });

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description);
    setEditType(transaction.type);
    setEditPaymentMethod(transaction.payment_method || "");
    setEditCategory(transaction.category || "");
    setEditTransactionDate(transaction.transaction_date?.split("T")[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditDescription("");
    setEditType("");
    setEditPaymentMethod("");
    setEditCategory("");
    setEditTransactionDate("");
  };

  const handleUpdate = async (id) => {
    if (
      !editAmount ||
      !editDescription.trim() ||
      !editType ||
      !editPaymentMethod ||
      !editCategory ||
      !editTransactionDate
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Number(editAmount) <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    try {
      await API.put(`/transactions/${id}`, {
        amount: Number(editAmount),
        description: editDescription.trim(),
        type: editType,
        payment_method: editPaymentMethod,
        category: editCategory,
        transaction_date: editTransactionDate,
      });

      toast.success("Transaction updated successfully");

      cancelEdit();
      fetchTransactions();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      toast.error("Transaction could not be updated.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      toast.error("Transaction could not be deleted.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-500 mt-1">
            Manage income and expenses with cash, bank and category tracking.
          </p>
        </div>

        <TransactionFilters
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
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
          editPaymentMethod={editPaymentMethod}
          setEditPaymentMethod={setEditPaymentMethod}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          editTransactionDate={editTransactionDate}
          setEditTransactionDate={setEditTransactionDate}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default Transactions;