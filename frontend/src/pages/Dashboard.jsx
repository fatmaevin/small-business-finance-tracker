import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setSummary(res.data);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/me");
        setUser(res.data);
      } catch (err) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    fetchUser();
    fetchDashboard();
  }, []);

  const handleTransaction = async () => {
    try {
      if (!amount || !type || !transactionDate) {
        alert("Please enter amount, type and date.");
        return;
      }

      await API.post("/transactions", {
        amount: Number(amount),
        description,
        type,
        transaction_date: transactionDate,
      });

      alert("Transaction added successfully");

      setAmount("");
      setDescription("");
      setType("");
      setTransactionDate(new Date().toISOString().split("T")[0]);

      fetchDashboard();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Data is not saved");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
  
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
  
        <SummaryCards summary={summary} />
  
        <div className="mt-8">
          <TransactionForm
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            type={type}
            setType={setType}
            transactionDate={transactionDate}
            setTransactionDate={setTransactionDate}
            handleTransaction={handleTransaction}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;