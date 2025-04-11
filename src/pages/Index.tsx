
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import ActionsList from '@/components/actions/ActionsList';
import { useHabit } from '@/contexts/HabitContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { habits } = useHabit();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="mt-2">
          <TaskList />
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Habits</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/habits')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.slice(0, 3).map((habit) => (
              <div 
                key={habit.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-primary"
                onClick={() => navigate('/habits')}
              >
                <h3 className="font-medium">{habit.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{habit.metric}</p>
              </div>
            ))}
            
            {habits.length === 0 && (
              <div className="col-span-full border border-dashed rounded-lg p-6 text-center">
                <p className="text-muted-foreground">No habits created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/habits')}
                  className="mt-2"
                >
                  Create a Habit
                </Button>
              </div>
            )}
          </div>
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
