
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import CalendarView from '@/components/calendar/CalendarView';

const CalendarPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
              <CalendarView />
            </main>
          </div>
          <FloatingActionButton />
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default CalendarPage;
