import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav>
      <h2>Business Finance Tracker</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>{" "}
        <Link to="/transactions">Transactions</Link>{" "}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;