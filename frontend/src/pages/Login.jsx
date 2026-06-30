import { useState } from "react";
import API from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.access_token) {
        alert("Login failed: Token gelmedi.");
        return;
      }

      localStorage.setItem("token", res.data.access_token);

      console.log("SAVED TOKEN:", localStorage.getItem("token"));

      alert("Login successful");
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;