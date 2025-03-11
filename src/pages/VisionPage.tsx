
import React from 'react';
import { VisionProvider } from '@/contexts/VisionContext';
import { TaskProvider } from '@/contexts/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import VisionList from '@/components/vision/VisionList';

const VisionPage: React.FC = () => {
  return (
    <TaskProvider>
      <VisionProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <VisionList />
          </div>
        </div>
      </VisionProvider>
    </TaskProvider>
  );
};

export default VisionPage;
