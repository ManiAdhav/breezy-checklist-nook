
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TargetsLayout from '@/components/targets/TargetsLayout';
import { useAuth } from '@/hooks/useAuth';

const NinetyDayTargetsPage: React.FC = () => {
  const { user, loading, handleSignOut, setUser } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If user is not logged in, show auth screen
  if (!user) {
    return <AuthForm onSignInSuccess={setUser} />;
  }
  
  return <TargetsLayout user={user} onSignOut={handleSignOut} />;
};

export default NinetyDayTargetsPage;
