import { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const handleTransaction = async () => {
    try {
      if (!amount || !type) {
        alert("Please enter amount and select type.");
        return;
      }
  
      await API.post("/transactions", {
        amount: Number(amount),
        description,
        type,
      });
  
      alert("Transaction added successfully");
  
      setAmount("");
      setDescription("");
      setType("");
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Data is not saved");
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
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

      <h2>Add Transaction</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button onClick={handleTransaction}>Add Transaction</button>
    </div>
  );
}

export default Dashboard;