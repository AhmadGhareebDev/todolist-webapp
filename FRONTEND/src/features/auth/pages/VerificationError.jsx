import { useNavigate, useSearchParams } from 'react-router-dom';

function VerificationError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  const errorMessages = {
    missing_token: 'The verification link is incomplete.',
    invalid_token: 'This verification link is invalid or has expired.',
    server_error: 'Something went wrong on our end. Please try again later.'
  };

  const message = errorMessages[reason] || 'Email verification failed.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center p-4">
       <div className="flex items-center sm:justify-start justify-center p-6 border-b mb-5 border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-xl font-bold shadow-lg">
            AA
          </div>
          <h1 className="font-bold text-2xl text-gray-800 ml-3 sm:block hidden">
            genda
          </h1>
        </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Verification Failed
        </h1>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <div className="space-y-3">
    
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
          >
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationError;