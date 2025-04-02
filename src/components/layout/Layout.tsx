
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="flex h-screen w-full bg-background overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col pl-[370px]">
            <Header />
            <main className="flex-1 overflow-y-auto py-4 px-4">
              {children}
            </main>
          </div>
          <Toaster />
        </div>
      </GoalProvider>
    </TaskProvider>
  );
};

export default Layout;
