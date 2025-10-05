import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function VerificationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alreadyVerified = searchParams.get('already') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="flex items-center sm:justify-start justify-center p-6 border-b mb-5 border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-xl font-bold shadow-lg">
            AA
          </div>
          <h1 className="font-bold text-2xl text-gray-800 ml-3 sm:block hidden">
            genda
          </h1>
        </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {alreadyVerified ? 'Already Verified!' : 'Email Verified!'}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {alreadyVerified 
            ? 'Your email was already verified. You can now log in to your account.'
            : 'Your email has been successfully verified! You can now log in to your account.'
          }
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default VerificationSuccess;
