
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import NinetyDayTargetList from '@/components/targets/NinetyDayTargetList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';

const NinetyDayTargetsPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <NinetyDayTargetList />
          </div>
          <FloatingActionButton />
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default NinetyDayTargetsPage;
