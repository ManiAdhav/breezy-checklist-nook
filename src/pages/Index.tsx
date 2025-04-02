
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import Notepad from '@/components/notepad/Notepad';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="p-4 flex flex-col space-y-4">
        <Notepad />
        <div className="mt-4">
          <TaskList />
        </div>
      </div>
      <FloatingActionButton />
    </Layout>
  );
};

export default Index;
