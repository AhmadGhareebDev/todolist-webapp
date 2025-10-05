import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";
import { useState, useEffect } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });
  const navigate = useNavigate();
  const { token } = useParams();

  const verifyToken = async () => {
    try {
      const response = await api.authApis.verifyResetToken(token);
      if (response.success) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setErrors((prev) => ({
          ...prev,
          general: "Invalid or expired reset link.",
        }));
      }
    } catch (error) {
      setTokenValid(false);
      setErrors((prev) => ({
        ...prev,
        general: "Invalid or expired reset link.",
      }));
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateFields = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ password: "", confirmPassword: "", general: "" });

    if (!validateFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authApis.resetPassword(token, password);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        if (response.errorCode === "INVALID_TOKEN") {
          setErrors((prev) => ({
            ...prev,
            general: "Invalid or expired reset link.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: response.message || "Something went wrong. Please try again.",
          }));
        }
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

  if (verifying) {
    return (
      <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl flex items-center justify-center">
        <p className="text-slate-600">Verifying reset link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-red-600">Invalid Link</h1>
        <p className="text-sm text-slate-600 text-center mb-8">
          This password reset link is invalid or has expired.
        </p>
        <div className="w-full text-center space-y-4">
          <button
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Link
          </button>
          <div>
            <button
              className="text-sky-600 text-xs hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-600">Success!</h1>
        <p className="text-sm text-slate-600 text-center mb-8">
          Your password has been reset successfully. Redirecting to login...
        </p>
        <div className="w-full text-center">
          <button
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
      <p className="text-sm text-slate-600 text-center mb-8">
        Enter your new password below.
      </p>

      {errors.general && (
        <p className="text-red-500 text-sm font-bold w-full text-center mb-3">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block font-medium text-sm text-slate-700 mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${
              errors.password ? "bg-red-100 ring-1 ring-red-400" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block font-medium text-sm text-slate-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${
              errors.confirmPassword ? "bg-red-100 ring-1 ring-red-400" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="w-full text-center">
          <button
            type="submit"
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 w-full text-center">
          <button
            type="button"
            className="text-sky-600 text-xs hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;