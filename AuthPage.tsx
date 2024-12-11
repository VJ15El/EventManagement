import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { authValidationSchema, AuthFormData } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Home } from 'lucide-react';
import { LoginBackground } from '../components/animations/LoginBackground';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, register: registerUser, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectMessage = location.state?.message;
  const redirectTo = location.state?.redirectTo || '/';
  
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authValidationSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    if (isLogin) {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(result.user?.isAdmin ? '/admin' : redirectTo);
      }
    } else {
      const result = await registerUser(data);
      if (result.success) {
        navigate(redirectTo);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LoginBackground />
      
      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg hover:bg-white/95 transition-colors z-20"
      >
        <Home className="w-5 h-5 text-blue-600" />
        <span className="text-blue-600 font-medium">Back to Events</span>
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isAdminLogin ? 'Admin Login' : (isLogin ? 'Sign in to your account' : 'Create a new account')}
        </h2>
        {redirectMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            {redirectMessage}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {!isLogin && !isAdminLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={isAdminLogin ? 'admin@eventhub.com' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={isAdminLogin ? 'Admin@123' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {!isLogin && !isAdminLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isAdminLogin ? 'Admin Sign In' : (isLogin ? 'Sign In' : 'Sign Up'))}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {!isAdminLogin && (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
            
            <button
              onClick={() => {
                setIsAdminLogin(!isAdminLogin);
                setIsLogin(true);
              }}
              className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-500"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdminLogin ? 'Back to User Login' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};