import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await API.get(`/verify-email?token=${token}`);
        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.log(err.response?.data);
        console.log(err.message);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              Verifying email...
            </h1>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-700">
              Email verified successfully!
            </h1>
            <p className="text-gray-500 mt-2">
              Redirecting you to the login page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-700">
              Verification failed
            </h1>
            <p className="text-gray-500 mt-2">
              The verification link is invalid or has already been used.
            </p>

            <Link
              to="/register"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg transition"
            >
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;