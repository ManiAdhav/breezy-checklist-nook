
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import { HabitProvider } from '@/contexts/habit/HabitProvider';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import CalendarView from '@/components/calendar/CalendarView';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

const CalendarPage: React.FC = () => {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <HabitProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="min-h-screen flex flex-col bg-[#F9F9F9] w-full">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <MobileSidebar />
                  <main className="flex-1 overflow-y-auto md:pl-[220px]">
                    <div className="p-6">
                      <CalendarView />
                    </div>
                  </main>
                </div>
                <FloatingActionButton />
                <Toaster />
              </div>
            </SidebarProvider>
          </HabitProvider>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default CalendarPage;
