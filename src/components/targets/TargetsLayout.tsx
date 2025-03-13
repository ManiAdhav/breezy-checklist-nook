
import React from 'react';
import { VisionProvider } from '@/contexts/VisionContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MilestoneList from '@/components/targets/MilestoneList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';

interface TargetsLayoutProps {
  user: any;
  onSignOut: () => void;
}

const TargetsLayout: React.FC<TargetsLayoutProps> = ({ user, onSignOut }) => {
  return (
    <VisionProvider>
      <TaskProvider>
        <GoalProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header user={user} onSignOut={onSignOut} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <MilestoneList user={user} />
            </div>
            <FloatingActionButton />
          </div>
        </GoalProvider>
      </TaskProvider>
    </VisionProvider>
  );
};

export default TargetsLayout;
