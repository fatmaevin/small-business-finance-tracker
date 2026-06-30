import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "14px 18px",
        },
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        },
      }}
    />
  </React.StrictMode>
);
