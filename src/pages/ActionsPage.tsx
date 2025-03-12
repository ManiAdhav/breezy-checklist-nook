
import React from 'react';
import Layout from '@/components/layout/Layout';
import ActionsView from '@/components/actions/ActionsView';
import { useTask } from '@/contexts/TaskContext';

const ActionsPage: React.FC = () => {
  const { tasks, isLoading } = useTask();
  
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Actions</h1>
        
        {isLoading ? (
          <div className="text-center py-10">Loading actions...</div>
        ) : (
          <ActionsView tasks={tasks} />
        )}
      </div>
    </Layout>
  );
};

export default ActionsPage;
