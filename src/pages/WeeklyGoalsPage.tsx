
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import WeeklyGoalList from '@/components/weekly/WeeklyGoalList';

const WeeklyGoalsPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <WeeklyGoalList />
          </div>
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default WeeklyGoalsPage;
