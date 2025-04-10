
import React, { useState } from 'react';
import { useHabit } from '@/contexts/HabitContext';
import HabitList from './HabitList';
import HabitDetail from './HabitDetail';
import AddHabitDialog from './AddHabitDialog';
import EmptyHabitState from './EmptyHabitState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const HabitTracker: React.FC = () => {
  const { habits } = useHabit();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);

  const handleHabitSelect = (habitId: string) => {
    setSelectedHabitId(habitId);
  };

  const handleAddHabit = () => {
    setIsAddHabitOpen(true);
  };

  const selectedHabit = selectedHabitId 
    ? habits.find(h => h.id === selectedHabitId) 
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-4 pt-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <Button 
          onClick={handleAddHabit}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <EmptyHabitState onAddHabit={handleAddHabit} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <HabitList 
              habits={habits} 
              selectedHabitId={selectedHabitId}
              onSelectHabit={handleHabitSelect}
            />
          </div>
          <div className="lg:col-span-7">
            {selectedHabit ? (
              <HabitDetail 
                habit={selectedHabit} 
                onClose={() => setSelectedHabitId(null)} 
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                <p>Select a habit to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 md:hidden">
        <Button 
          onClick={handleAddHabit} 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AddHabitDialog 
        open={isAddHabitOpen} 
        onOpenChange={setIsAddHabitOpen} 
      />
    </div>
  );
};

export default HabitTracker;
