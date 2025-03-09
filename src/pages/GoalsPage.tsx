
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GoalList from '@/components/goals/GoalList';

const GoalsPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-[#f9fafb]">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <GoalList />
          </div>
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default GoalsPage;
