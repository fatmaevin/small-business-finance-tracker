import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-gray-900">
          💼 Business Finance Tracker
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Transactions
          </Link>
          <Link
            to="/reports"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Reports
          </Link>

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;