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
    <div>
      <Navbar />

      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>

      <SummaryCards summary={summary} />

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
  );
}

export default Dashboard;