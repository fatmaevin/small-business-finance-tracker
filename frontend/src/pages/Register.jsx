import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      await API.post("/register", {
        name: name.trim(),
        email,
        password,
      });

      toast.success("Registration successful. Please check your email.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Registration failed.");
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">WeeklyBook</h1>

          <p className="text-gray-500 mt-2">
            Create your account to start tracking your business finances.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;