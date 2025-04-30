
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import { HabitProvider } from '@/contexts/habit/HabitProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <HabitProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="flex h-screen w-full bg-background overflow-hidden">
                <Sidebar />
                <MobileSidebar />
                <div className="flex-1 flex flex-col md:ml-[220px]">
                  <Header />
                  <main className="flex-1 overflow-y-auto pb-6">
                    <div className="container mx-auto px-4 pt-4">
                      {children}
                    </div>
                  </main>
                </div>
                <Toaster />
              </div>
            </SidebarProvider>
          </HabitProvider>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default Layout;
