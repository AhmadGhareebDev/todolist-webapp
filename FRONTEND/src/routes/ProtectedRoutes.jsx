import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from 'react';
import api from '../api/api';
function ProtectedRoute() {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        
        try {
          const refreshResult = await api.authApis.refreshToken();
          
          if (refreshResult.success) {
            setAuth(refreshResult.accessToken, refreshResult.user);
          } else {
            clearAuth(); 
          }
        } catch (error) {
          console.log('Refresh error:', error);
          clearAuth();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, setAuth, clearAuth]);

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;