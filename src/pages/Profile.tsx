
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ProfileForm from '@/components/ProfileForm';

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-16 container-custom">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Your Profile</h1>
          <p className="text-muted-foreground">
            Tell us about yourself so we can create personalized nutrition recommendations for you
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
