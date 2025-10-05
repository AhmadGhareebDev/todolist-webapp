import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useState } from "react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    general: "",
  });
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: "Email is required.", general: "" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email.", general: "" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", general: "" });
    setSuccess(false);

    if (!validateEmail()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authApis.requestPasswordReset(email);

      if (response.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.message || "Something went wrong. Please try again.",
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
      <p className="text-sm text-slate-600 text-center mb-8">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-700 text-sm text-center">
            If an account exists with this email, a password reset link has been sent.
            Please check your inbox.
          </p>
        </div>
      ) : null}

      {errors.general && (
        <p className="text-red-500 text-sm font-bold w-full text-center mb-3">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block font-medium text-sm text-slate-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${
              errors.email ? "bg-red-100 ring-1 ring-red-400" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="w-full text-center">
          <button
            type="submit"
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 w-full text-center space-y-2">
          <button
            type="button"
            className="text-sky-600 text-xs hover:underline block w-full"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
          <div>
            <p className="text-xs text-slate-400 mb-1">Don't have an Account?</p>
            <button
              type="button"
              className="text-sky-600 text-xs hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;