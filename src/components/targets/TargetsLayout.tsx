
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import MilestoneList from '@/components/targets/MilestoneList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';

interface TargetsLayoutProps {
  user: any | null;
  onSignOut: () => void;
}

const TargetsLayout: React.FC<TargetsLayoutProps> = ({ user, onSignOut }) => {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <div className="min-h-screen flex flex-col bg-background w-full">
            <Header user={user} onSignOut={onSignOut} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <MobileSidebar />
              <MilestoneList user={user} />
            </div>
            <FloatingActionButton />
          </div>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default TargetsLayout;
