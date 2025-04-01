
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useGoal } from '@/contexts/GoalContext';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Plan } from '@/types/task';
import { format, startOfWeek, addDays } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PlanForm from '@/components/weekly/PlanForm';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import WeeklyTaskForm from '@/components/weekly/WeeklyTaskForm';

const WeeklyPlanPage: React.FC = () => {
  const { plans, threeYearGoals } = useGoal();
  const { tasks, addTask } = useTask();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Get the current week's days
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter tasks by plan
  const getTasksForDay = (day: Date) => {
    if (!selectedPlan) return [];
    
    return tasks.filter(task => {
      if (!task.dueDate || !task.planId || task.planId !== selectedPlan.id) return false;
      
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day.getDate() && 
        taskDate.getMonth() === day.getMonth() && 
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const handleAddTask = (day: Date) => {
    if (!selectedPlan) return;
    setSelectedDay(day);
    setIsTaskSheetOpen(true);
  };

  const handleClosePlanDialog = () => {
    setIsPlanDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekly Plan</h1>
          <Button onClick={() => setIsPlanDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="mb-6">
          <Select 
            value={selectedPlan?.id || ''} 
            onValueChange={(value) => {
              const plan = plans.find(p => p.id === value);
              setSelectedPlan(plan || null);
            }}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.length === 0 ? (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No plans available. Create one first.
                </div>
              ) : (
                plans.map((plan) => {
                  const goal = threeYearGoals.find(g => {
                    // Find the target for this plan, then find the goal for that target
                    const target = plan.ninetyDayTargetId;
                    return g.targets?.some(t => t.id === target);
                  });
                  
                  return (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title} {goal ? `(${goal.title})` : ''}
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedPlan ? (
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <Card key={index} className="min-h-[180px]">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {format(day, 'E')}
                      </div>
                      <CardTitle className="text-lg">{format(day, 'd')}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleAddTask(day)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {getTasksForDay(day).map(task => (
                      <div key={task.id} className="bg-muted p-2 rounded text-xs group relative">
                        <div className="flex justify-between items-center">
                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-lg border-gray-300">
            <p className="text-muted-foreground">
              Select a plan or create a new one to start scheduling tasks for the week.
            </p>
          </div>
        )}

        {/* Plan Dialog */}
        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <PlanForm 
              initialPlan={null} 
              onClose={handleClosePlanDialog}
            />
          </DialogContent>
        </Dialog>

        {/* Task Sheet */}
        <Sheet open={isTaskSheetOpen} onOpenChange={setIsTaskSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                Add Task for {selectedDay ? format(selectedDay, 'EEEE, MMMM d') : ''}
              </SheetTitle>
            </SheetHeader>
            {selectedDay && selectedPlan && (
              <WeeklyTaskForm 
                planId={selectedPlan.id}
                date={selectedDay}
                onClose={() => setIsTaskSheetOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default WeeklyPlanPage;
