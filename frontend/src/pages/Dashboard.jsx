import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";
import toast from "react-hot-toast";

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
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    fetchUser();
    fetchDashboard();
  }, []);

  const handleTransaction = async () => {
    const trimmedDescription = description.trim();
  
    if (!amount || !trimmedDescription || !type || !transactionDate) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }
  
    try {
      await API.post("/transactions", {
        amount: Number(amount),
        description: trimmedDescription,
        type,
        transaction_date: transactionDate,
      });
  
      toast.success("Transaction added successfully.");
  
      setAmount("");
      setDescription("");
      setType("");
      setTransactionDate(new Date().toISOString().split("T")[0]);
  
      fetchDashboard();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
  
      toast.error("Transaction could not be added.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
  
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
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