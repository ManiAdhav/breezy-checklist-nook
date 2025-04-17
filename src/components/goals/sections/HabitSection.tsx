
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHabitSection } from './habits/useHabitSection';
import EmptyHabitState from './habits/EmptyHabitState';
import HabitCard from './habits/HabitCard';
import HabitDetailDialog from './habits/HabitDetailDialog';
import AddHabitDialog from './habits/AddHabitDialog';

interface HabitSectionProps {
  goalId: string;
  limit?: number;
}

const HabitSection: React.FC<HabitSectionProps> = ({ goalId, limit }) => {
  const {
    goalHabits,
    displayHabits,
    hasMoreHabits,
    isAddHabitDialogOpen,
    setIsAddHabitDialogOpen,
    isHabitDetailOpen,
    setIsHabitDetailOpen,
    selectedHabit,
    isCompletedToday,
    calculateProgress,
    toggleHabitCompletion,
    handleAddHabit,
    handleViewHabitDetail,
    handleAddBasicHabit,
    getHabitStreak,
    habitLogs
  } = useHabitSection({ goalId, limit });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Consistent activities that support your goal</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleAddHabit}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Habit
        </Button>
      </div>
      
      {goalHabits.length === 0 ? (
        <EmptyHabitState onAddHabit={handleAddHabit} />
      ) : (
        <div className="space-y-3">
          {displayHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              progress={calculateProgress(habit)}
              streak={getHabitStreak(habit.id)}
              completed={isCompletedToday(habit)}
              onToggleCompletion={toggleHabitCompletion}
              onViewDetail={handleViewHabitDetail}
            />
          ))}
          
          {hasMoreHabits && (
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              +{goalHabits.length - limit} more habits
            </Button>
          )}
        </div>
      )}
      
      {/* Add Habit Dialog */}
      <AddHabitDialog
        isOpen={isAddHabitDialogOpen}
        onOpenChange={setIsAddHabitDialogOpen}
        onAddBasicHabit={handleAddBasicHabit}
      />
      
      {/* Habit Detail Dialog */}
      <HabitDetailDialog
        habit={selectedHabit}
        isOpen={isHabitDetailOpen}
        onOpenChange={setIsHabitDetailOpen}
        habitLogs={selectedHabit ? habitLogs.filter(log => log.habitId === selectedHabit.id) : []}
        streak={selectedHabit ? getHabitStreak(selectedHabit.id) : { current: 0, longest: 0 }}
        isCompletedToday={selectedHabit ? isCompletedToday(selectedHabit) : false}
        onToggleCompletion={toggleHabitCompletion}
      />
    </div>
  );
};

export default HabitSection;
