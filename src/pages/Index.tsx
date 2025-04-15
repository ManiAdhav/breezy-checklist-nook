
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import ActionsList from '@/components/actions/ActionsList';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="mt-2">
          <TaskList />
        </div>
        
        <div className="mt-4">
          <ActionsList />
        </div>
      </div>
      <FloatingActionButton />
    </Layout>
  );
};

export default Index;
