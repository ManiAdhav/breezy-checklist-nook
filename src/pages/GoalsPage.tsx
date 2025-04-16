
import React from 'react';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { VisionProvider } from '@/contexts/VisionContext';
import { HabitProvider } from '@/contexts/habit/HabitProvider';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import GoalList from '@/components/goals/GoalList';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GoalsPage: React.FC = () => {
  const { user, loading, handleSignOut } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <HabitProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="min-h-screen flex flex-col bg-background w-full">
                <Header user={user} onSignOut={handleSignOut} />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <MobileSidebar />
                  <main className="flex-1 overflow-y-auto md:pl-[220px]">
                    <GoalList />
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

export default GoalsPage;
