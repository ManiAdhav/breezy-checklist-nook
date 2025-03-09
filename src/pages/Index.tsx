
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
              <TaskList />
            </main>
          </div>
          <FloatingActionButton />
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default Index;
