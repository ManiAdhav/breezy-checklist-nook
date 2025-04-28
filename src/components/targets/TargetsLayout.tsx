
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import { HabitProvider } from '@/contexts/HabitContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

interface TargetsLayoutProps {
  user: any | null;
  onSignOut: () => void;
}

const TargetsLayout: React.FC<TargetsLayoutProps> = ({ user, onSignOut }) => {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <HabitProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="min-h-screen flex flex-col bg-background w-full">
                <Header user={user} onSignOut={onSignOut} />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <MobileSidebar />
                  <main className="flex-1 overflow-y-auto md:pl-[220px]">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-6">Goals & Tasks</h1>
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

export default TargetsLayout;
