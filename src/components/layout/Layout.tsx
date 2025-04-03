
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <TaskProvider>
      <GoalProvider>
        <div className="flex min-h-screen w-full bg-background overflow-hidden">
          <Sidebar />
          <MobileSidebar />
          <div className="flex-1 flex flex-col md:pl-[260px]">
            <Header />
            <main className="flex-1 overflow-y-auto">
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
