
import React from 'react';
import { VisionProvider } from '@/contexts/VisionContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import VisionList from '@/components/vision/VisionList';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AuthForm from '@/components/auth/AuthForm';

const VisionPage: React.FC = () => {
  const { user, loading, handleSignOut, setUser } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If user is not logged in, show auth screen
  if (!user) {
    return <AuthForm onSignInSuccess={setUser} />;
  }
  
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header user={user} onSignOut={handleSignOut} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <VisionList />
            </div>
          </div>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default VisionPage;
