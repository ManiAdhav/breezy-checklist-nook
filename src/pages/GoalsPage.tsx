
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { VisionProvider } from '@/contexts/VisionContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GoalList from '@/components/goals/GoalList';

const GoalsPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <GoalList />
              </main>
            </div>
          </div>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default GoalsPage;
