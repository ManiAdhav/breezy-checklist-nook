
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import WeeklyGoalItem from './WeeklyGoalItem';
import WeeklyGoalForm from './WeeklyGoalForm';
import { Button } from '@/components/ui/button';
import { WeeklyGoal, NinetyDayTarget } from '@/types/task';
import { Plus, Calendar, Target } from 'lucide-react';
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import PlanDetailView from './PlanDetailView';

const WeeklyGoalList: React.FC = () => {
  const { weeklyGoals, ninetyDayTargets } = useGoal();
  
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [suggestedGoals, setSuggestedGoals] = useState<Array<Omit<WeeklyGoal, 'id' | 'createdAt' | 'updatedAt'>>>([]);
  const [selectedPlan, setSelectedPlan] = useState<WeeklyGoal | null>(null);
  
  // Calculate the current week's end date
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  // Filter goals for the current week
  const currentWeekGoals = weeklyGoals.filter(goal => {
    const goalStart = new Date(goal.startDate);
    return goalStart >= currentWeekStart && goalStart <= currentWeekEnd;
  });
  
  // Calculate progress
  const completedGoals = currentWeekGoals.filter(goal => goal.status === 'completed').length;
  const progressPercentage = currentWeekGoals.length > 0 
    ? Math.round((completedGoals / currentWeekGoals.length) * 100) 
    : 0;

  // Generate week days for display
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(addDays(currentWeekStart, i), 'EEE, MMM d')
  );
  
  // Auto-suggest goals based on 90-day targets
  useEffect(() => {
    // Find active 90-day targets that don't already have weekly goals for this week
    const activeTargets = ninetyDayTargets.filter(target => 
      target.status === 'in_progress' && 
      !weeklyGoals.some(goal => 
        goal.ninetyDayTargetId === target.id && 
        new Date(goal.startDate) >= currentWeekStart && 
        new Date(goal.endDate) <= currentWeekEnd
      )
    );
    
    // Create suggested goals
    const newSuggestions = activeTargets.map(target => ({
      title: `Work on: ${target.title}`,
      description: `Weekly plan derived from 90-day target: ${target.title}`,
      startDate: currentWeekStart,
      endDate: currentWeekEnd,
      status: 'not_started' as const,
      ninetyDayTargetId: target.id
    }));
    
    setSuggestedGoals(newSuggestions);
  }, [ninetyDayTargets, weeklyGoals, currentWeekStart.toISOString(), currentWeekEnd.toISOString()]);
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsGoalFormOpen(true);
  };
  
  const handleEditGoal = (goal: WeeklyGoal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };
  
  const handleViewPlan = (plan: WeeklyGoal) => {
    setSelectedPlan(plan);
  };
  
  const previousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };
  
  const nextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };
  
  // If a plan is selected, render the plan detail view
  if (selectedPlan) {
    return (
      <PlanDetailView 
        plan={selectedPlan} 
        onBack={() => setSelectedPlan(null)}
        onEdit={handleEditGoal}
      />
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-2xl font-semibold">Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentWeekGoals.length} plans this week
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAddGoal} 
            className="flex items-center"
            disabled={ninetyDayTargets.length === 0}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Plan</span>
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between bg-muted/30">
        <Button variant="outline" size="sm" onClick={previousWeek}>
          Previous Week
        </Button>
        <h3 className="text-lg font-medium">
          {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
        </h3>
        <Button variant="outline" size="sm" onClick={nextWeek}>
          Next Week
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="px-6 py-3 bg-background">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Weekly Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedGoals} of {currentWeekGoals.length} completed
          </span>
        </div>
        <Progress value={progressPercentage} className="w-full h-2" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Week days display */}
        <div className="grid grid-cols-7 gap-1 px-6 py-2 border-y border-border bg-muted/20">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {ninetyDayTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No 90-day targets yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              You need to create 90-day targets before you can create plans.
            </p>
          </div>
        ) : currentWeekGoals.length === 0 && suggestedGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No plans for this week</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add weekly plans to help you achieve your 90-day targets.
            </p>
            <Button onClick={handleAddGoal} className="mt-6">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Plan</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Current Week Goals */}
            {currentWeekGoals.length > 0 && (
              <div className="p-4">
                <h3 className="font-medium mb-3">Current Plans</h3>
                <div className="space-y-2">
                  {currentWeekGoals.map(goal => (
                    <WeeklyGoalItem 
                      key={goal.id} 
                      goal={goal} 
                      onEdit={handleEditGoal}
                      onView={() => handleViewPlan(goal)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Suggested Goals */}
            {suggestedGoals.length > 0 && (
              <div className="p-4 bg-muted/20">
                <h3 className="font-medium mb-3">Suggested Plans</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your active 90-day targets
                </p>
                <div className="space-y-2">
                  {suggestedGoals.map((goal, index) => (
                    <div 
                      key={index}
                      className="p-3 border border-border rounded-md bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingGoal(null);
                        setIsGoalFormOpen(true);
                        // Pre-populate form with suggested goal
                        setEditingGoal({
                          ...goal,
                          id: 'temp',
                          createdAt: new Date(),
                          updatedAt: new Date()
                        } as WeeklyGoal);
                      }}
                    >
                      <div className="font-medium">{goal.title}</div>
                      {goal.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {goal.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <WeeklyGoalForm 
        isOpen={isGoalFormOpen} 
        onClose={() => setIsGoalFormOpen(false)}
        editingGoal={editingGoal}
        currentWeekStart={currentWeekStart}
        currentWeekEnd={currentWeekEnd}
      />
    </div>
  );
};

export default WeeklyGoalList;
