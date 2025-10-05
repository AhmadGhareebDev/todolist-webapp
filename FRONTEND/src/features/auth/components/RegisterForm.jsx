import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useState, useEffect } from "react";

export default function RegisterForm() {
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    general: '',
  });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [send, setSend] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
      username: '',
      password: '',
      email: '',
      general: ''
    };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length > 21) {
      newErrors.username = "Username cannot be longer than 21 characters.";
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid Email.';
    }

    setErrors(newErrors);

    return !newErrors.username && !newErrors.email && !newErrors.password;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ username: '', email: '', password: '', general: '' }); 

    if (!validateFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authApis.register(email, username, password);

      if (response.success) {
        setRegisteredEmail(email);
        setShowVerificationMessage(true);
      } else {
        if (response.errorCode === 'EMAIL_EXISTS') {
          setErrors(prev => ({ ...prev, email: 'This email is already registered.' }));
        } else if (response.errorCode === 'USERNAME_EXISTS') {
          setErrors(prev => ({ ...prev, username: 'This username is already taken.' }));
        } else {
          setErrors(prev => ({ ...prev, general: response.message }));
        }
      }
    } catch (error) {
      console.error(error);
      setErrors(prev => ({ ...prev, general: 'Something went wrong. Please try again.' }));
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
          setErrors({ 
            username: '', 
            email: 'This email is already verified. Please log in.', 
            password: '', 
            general: '' 
          });
          setShowVerificationMessage(false);
          setCountdown(0); 
        } else {
          setCountdown(30);
        }
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
      setErrors(prev => ({ ...prev, general: 'Something went wrong. Please try again.' }));
    } finally {
      setSend(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 text-center">
        <h1 className="text-2xl font-bold mb-6 text-emerald-600">Registration Successful!</h1>
        
        <div className="mb-6">
          <p className="text-slate-700 mb-4">
            We've sent a verification email to:
          </p>
          <p className="font-semibold text-sky-600 mb-4">
            {registeredEmail}
          </p>
          <p className="text-sm text-slate-600">
            Please check your email and click the verification link to activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Already verified your email?
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 font-medium transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-2">
            Didn't receive the email?
          </p>
          <button 
            className={`text-sky-600 text-xs hover:underline ${countdown > 0 ? 'text-slate-400 cursor-not-allowed' : ''}`}
            onClick={handleResendVerificationEmail}
            disabled={countdown > 0 || send}
          >
            {send 
              ? 'Resending...' 
              : countdown > 0 
                ? `Resend available in ${countdown}s` 
                : 'Resend verification email'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md w-[350px] min-h-[350px] bg-white sm:m-2 m-5 p-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-8">Register</h1>
      {errors.general && (
        <p className="text-red-500 text-sm font-bold w-full text-center mb-3">
          {errors.general}
        </p>
      )}
      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${errors.username ? 'bg-red-100 ring-1 ring-red-400' : ''}`}
          />
          {errors.username && (
            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
          )}
        </div>

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
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${errors.email ? 'bg-red-100 ring-1 ring-red-400' : ''}`}
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
            className={`px-3 py-2 rounded-md w-full bg-sky-50 ring-1 ring-sky-300 focus:ring-2 focus:ring-sky-500 ${errors.password ? 'bg-red-100 ring-1 ring-red-400' : ''}`}
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="w-full text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-400 px-8 py-2 rounded-md hover:bg-sky-500 text-white font-medium transition-colors duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 w-full text-center">
          <p className="text-xs text-slate-400 mb-2">
            Already have an Account?
          </p>
          <button
            className="text-sky-600 text-xs hover:underline"
            onClick={() => {
              navigate('/login')
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}