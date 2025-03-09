
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import NinetyDayTargetList from '@/components/targets/NinetyDayTargetList';

const NinetyDayTargetsPage: React.FC = () => {
  return (
    <GoalProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <NinetyDayTargetList />
        </div>
      </div>
    </GoalProvider>
  );
};

export default NinetyDayTargetsPage;
