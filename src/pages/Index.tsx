
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import ActionsList from '@/components/actions/ActionsList';
import { useHabit } from '@/contexts/HabitContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Index: React.FC = () => {
  const { habits, isLoading, loadHabits } = useHabit();
  const navigate = useNavigate();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  useEffect(() => {
    console.log('Index page mounted, habits count:', habits.length);
    
    // Force reload habits when component mounts
    const loadData = async () => {
      try {
        console.log('Index page: Forcing reload of habits data');
        await loadHabits();
        
        console.log('Index page: Habits data reloaded successfully, count:', habits.length);
        setInitialLoadComplete(true);
        
        if (habits.length > 0) {
          toast({
            title: "Data loaded",
            description: `${habits.length} habits loaded successfully`,
          });
        }
      } catch (error) {
        console.error('Error loading habits on index page:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your habits",
          variant: "destructive",
        });
      }
    };
    
    loadData();
    
    return () => {
      console.log('Index page unmounted');
    };
  }, [loadHabits]);

  useEffect(() => {
    // Log whenever habits change
    console.log('Habits updated on index page, count:', habits.length, habits);
  }, [habits]);

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
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.length > 0 ? (
                habits.slice(0, 3).map((habit) => (
                  <div 
                    key={habit.id}
                    className="border rounded-lg p-4 cursor-pointer hover:border-primary"
                    onClick={() => navigate('/habits')}
                  >
                    <h3 className="font-medium">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{habit.metric}</p>
                    {habit.streak !== undefined && (
                      <div className="mt-2 text-xs inline-flex items-center bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {habit.streak} day streak
                      </div>
                    )}
                  </div>
                ))
              ) : (
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
          )}
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
