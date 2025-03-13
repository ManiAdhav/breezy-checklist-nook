
import React from 'react';
import TargetsLayout from '@/components/targets/TargetsLayout';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MilestonePage: React.FC = () => {
  const { user, loading, handleSignOut } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <TargetsLayout user={user} onSignOut={handleSignOut} />;
};

export default MilestonePage;
