import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import PlanItem from './PlanItem';
import PlanForm from './PlanForm';
import { Button } from '@/components/ui/button';
import { Plan, NinetyDayTarget } from '@/types/task';
import { Plus, Calendar, Target } from 'lucide-react';
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import PlanDetailView from './PlanDetailView';

const PlanList: React.FC = () => {
  const { plans, ninetyDayTargets } = useGoal();
  
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [suggestedPlans, setSuggestedPlans] = useState<Array<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // Calculate the current week's end date
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  // Filter plans for the current week
  const currentWeekPlans = plans.filter(plan => {
    const planStart = new Date(plan.startDate);
    return planStart >= currentWeekStart && planStart <= currentWeekEnd;
  });
  
  // Calculate progress
  const completedPlans = currentWeekPlans.filter(plan => plan.status === 'completed').length;
  const progressPercentage = currentWeekPlans.length > 0 
    ? Math.round((completedPlans / currentWeekPlans.length) * 100) 
    : 0;

  // Generate week days for display
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(addDays(currentWeekStart, i), 'EEE, MMM d')
  );
  
  // Auto-suggest plans based on 90-day targets
  useEffect(() => {
    // Find active 90-day targets that don't already have plans for this week
    const activeTargets = ninetyDayTargets.filter(target => 
      target.status === 'in_progress' && 
      !plans.some(plan => 
        plan.ninetyDayTargetId === target.id && 
        new Date(plan.startDate) >= currentWeekStart && 
        new Date(plan.endDate) <= currentWeekEnd
      )
    );
    
    // Create suggested plans
    const newSuggestions = activeTargets.map(target => ({
      title: `Work on: ${target.title}`,
      description: `Weekly plan derived from 90-day target: ${target.title}`,
      startDate: currentWeekStart,
      endDate: currentWeekEnd,
      status: 'not_started' as const,
      ninetyDayTargetId: target.id
    }));
    
    setSuggestedPlans(newSuggestions);
  }, [ninetyDayTargets, plans, currentWeekStart.toISOString(), currentWeekEnd.toISOString()]);
  
  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsPlanFormOpen(true);
  };
  
  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsPlanFormOpen(true);
  };
  
  const handleViewPlan = (plan: Plan) => {
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
        onEdit={handleEditPlan}
      />
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-2xl font-semibold">Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentWeekPlans.length} plans this week
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAddPlan} 
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
            {completedPlans} of {currentWeekPlans.length} completed
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
        ) : currentWeekPlans.length === 0 && suggestedPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No plans for this week</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add weekly plans to help you achieve your 90-day targets.
            </p>
            <Button onClick={handleAddPlan} className="mt-6">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Plan</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Current Week Plans */}
            {currentWeekPlans.length > 0 && (
              <div className="p-4">
                <h3 className="font-medium mb-3">Current Plans</h3>
                <div className="space-y-2">
                  {currentWeekPlans.map(plan => (
                    <PlanItem 
                      key={plan.id} 
                      plan={plan} 
                      onEdit={handleEditPlan}
                      onView={() => handleViewPlan(plan)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Suggested Plans */}
            {suggestedPlans.length > 0 && (
              <div className="p-4 bg-muted/20">
                <h3 className="font-medium mb-3">Suggested Plans</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your active 90-day targets
                </p>
                <div className="space-y-2">
                  {suggestedPlans.map((plan, index) => (
                    <div 
                      key={index}
                      className="p-3 border border-border rounded-md bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingPlan(null);
                        setIsPlanFormOpen(true);
                        // Pre-populate form with suggested plan
                        setEditingPlan({
                          ...plan,
                          id: 'temp',
                          createdAt: new Date(),
                          updatedAt: new Date()
                        } as Plan);
                      }}
                    >
                      <div className="font-medium">{plan.title}</div>
                      {plan.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {plan.description}
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
      
      <PlanForm 
        isOpen={isPlanFormOpen} 
        onClose={() => setIsPlanFormOpen(false)}
        editingPlan={editingPlan}
        currentWeekStart={currentWeekStart}
        currentWeekEnd={currentWeekEnd}
      />
    </div>
  );
};

export default PlanList;
