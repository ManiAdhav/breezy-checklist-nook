
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="p-0">
        <TaskList />
      </div>
      <FloatingActionButton />
    </Layout>
  );
};

export default Index;
