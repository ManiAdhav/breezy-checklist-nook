
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import MilestoneList from '@/components/targets/MilestoneList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
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
          <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex flex-col bg-background w-full">
              <Header user={user} onSignOut={onSignOut} />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <MobileSidebar />
                <main className="flex-1 overflow-y-auto">
                  <MilestoneList user={user} />
                </main>
              </div>
              <FloatingActionButton />
              <Toaster />
            </div>
          </SidebarProvider>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
};

export default TargetsLayout;
