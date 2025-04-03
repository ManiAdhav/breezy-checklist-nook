
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import VisionList from '@/components/vision/VisionList';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const VisionPage: React.FC = () => {
  const { user, loading, handleSignOut } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <div className="min-h-screen flex flex-col bg-background w-full">
            <Header user={user} onSignOut={handleSignOut} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <MobileSidebar />
              <VisionList />
            </div>
          </div>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default VisionPage;
