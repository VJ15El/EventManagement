import { useState } from 'react';
import { AuthFormData, AuthResponse } from '../types/auth';
import { AuthValidation } from '../utils/authValidation';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthValidation.login(email, password);
      
      if (response.success && response.user) {
        setCurrentUser(response.user);
        navigate('/');
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      setError('An unexpected error occurred');
      return {
        success: false,
        message: 'An unexpected error occurred'
      } as AuthResponse;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: AuthFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthValidation.register(data);
      
      if (response.success && response.user) {
        setCurrentUser(response.user);
        navigate('/');
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      setError('An unexpected error occurred');
      return {
        success: false,
        message: 'An unexpected error occurred'
      } as AuthResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error
  };
}