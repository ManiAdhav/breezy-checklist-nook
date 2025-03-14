
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ActionsView from '@/components/actions/ActionsView';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddActionDialog from '@/components/actions/AddActionDialog';

const ActionsPage: React.FC = () => {
  const { tasks, isLoading } = useTask();
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  
  // Filter out only actions
  const actionTasks = tasks.filter(task => task.isAction);
  
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Actions</h1>
          <Button 
            variant="action"
            onClick={() => setIsAddActionOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Action
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading actions...</div>
        ) : (
          <ActionsView tasks={actionTasks} />
        )}
        
        <AddActionDialog 
          open={isAddActionOpen} 
          onOpenChange={setIsAddActionOpen} 
        />
      </div>
    </Layout>
  );
};

export default ActionsPage;
