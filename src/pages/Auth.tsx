
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';

const Auth = () => {
  const { type } = useParams<{ type: string }>();
  const { isAuthenticated } = useAuth();
  
  // Redirect to profile if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }
  
  // Validate auth type
  if (type !== 'login' && type !== 'signup') {
    return <Navigate to="/auth/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-16 container-custom">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">
            {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-muted-foreground">
            {type === 'login' 
              ? 'Sign in to access your personalized nutrition recommendations'
              : 'Join NutrienGuide for personalized nutrition guidance'}
          </p>
        </div>
        
        <AuthForm type={type as 'login' | 'signup'} />
      </div>
    </div>
  );
};

export default Auth;
