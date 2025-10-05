import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(true);
  const [send, setSend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateFields = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "please enter a valid Email.";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password && !newErrors.general;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ password: "", email: "", general: "" });

    if (!validateFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authApis.login(email, password);

      if (response.success) {
        const { accessToken, user } = response.data.data;
        useAuthStore.getState().setAuth(accessToken, user);
        navigate("/dashboard");
      } else {
        if (response.errorCode === "USER_NOT_FOUND") {
          setErrors((prev) => ({
            ...prev,
            email: "Did not find a user with this email",
          }));
        } else if (response.errorCode === "EMAIL_NOT_VERIFIED") {
          setErrors((prev) => ({
            ...prev,
            email: "This email is not verified yet, please verify your email.",
          }));
          setShowVerifyEmail(true);
        } else if (response.errorCode === "INVALID_PASSWORD") {
          setErrors((prev) => ({ ...prev, password: "Wrong password" }));
        } else {
          setErrors((prev) => ({ ...prev, general: response.message }));
        }
      }
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;
    
    setSend(true);
    try {
      const response = await api.authApis.resendVerificationEmail(email);
      if (response.success) {
        if (response.code === "ALREADY_VERIFIED") {
          setErrors((prev) => ({ ...prev, email: response.message }));
          return;
        }
        setCountdown(30);
      } else {
        if (response.errorCode === "MISSING_FIELDS") {
          setErrors((prev) => ({ ...prev, email: response.message }));
        } else if (response.errorCode === "USER_NOT_FOUND") {
          setErrors((prev) => ({ ...prev, email: response.message }));
        } else {
          setErrors((prev) => ({ ...prev, general: response.message }));
        }
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
      {errors.general && (
        <p className="text-red-500 text-sm font-bold w-full text-center mb-3">
          {errors.general}
        </p>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
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

        <div>
          <label
            htmlFor="password"
            className="block font-medium text-sm text-slate-700 mb-2"
          >
            Password
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

        <div className="w-full text-right">
          <button
            type="button"
            className="text-sky-600 text-xs hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <div className="w-full text-center">
          <button
            type="submit"
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Login"}
          </button>
        </div>

        <button
          className={`text-sky-600 text-xs hover:underline w-full text-center ${
            !showVerifyEmail ? "hidden" : ""
          } ${countdown > 0 ? "text-slate-400 cursor-not-allowed" : ""}`}
          onClick={handleResendVerificationEmail}
          disabled={countdown > 0 || send}
        >
          {send 
            ? 'Resending...' 
            : countdown > 0 
              ? `Resend available in ${countdown}s` 
              : 'Resend verification email'}
        </button>

        <div className="mt-6 pt-4 border-t border-slate-200 w-full text-center">
          <p className="text-xs text-slate-400 mb-2">Don't have an Account?</p>
          <button
            type="button"
            className="text-sky-600 text-xs hover:underline"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;