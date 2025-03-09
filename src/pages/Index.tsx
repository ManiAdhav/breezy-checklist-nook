
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TaskList from '@/components/tasks/TaskList';

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <TaskList />
          </div>
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default Index;
