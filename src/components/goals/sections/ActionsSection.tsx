
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { 
  Button, 
  Calendar,
  Plus,
  ListChecks,
  Milestone,
  Target
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ActionsSectionProps {
  goalId: string;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ goalId }) => {
  const { tasks, addTask, toggleTaskCompletion } = useTask();
  const { threeYearGoals, weeklyGoals } = useGoal();
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedWeeklyGoalId, setSelectedWeeklyGoalId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(addDays(new Date(), 7));
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('milestones');
  
  // Get the goal
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  // Get all actions associated with this goal
  const goalActions = tasks.filter(task => {
    // Find the weekly goal associated with this task
    const weeklyGoal = goal?.targets
      ?.flatMap(target => target.weeklyGoals || [])
      .find(wg => wg.id === task.weeklyGoalId);
    
    return weeklyGoal && task.isAction && !task.completed;
  });
  
  // Get all the weekly goals for this goal
  const getWeeklyGoalsForGoal = () => {
    if (!goal) return [];
    return goal.targets?.flatMap(target => target.weeklyGoals || []) || [];
  };
  
  // Add new action
  const handleAddAction = () => {
    if (!newActionTitle.trim()) {
      toast({
        title: "Error",
        description: "Action title is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWeeklyGoalId) {
      toast({
        title: "Error",
        description: "Please select a plan for this action",
        variant: "destructive",
      });
      return;
    }

    const newAction: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newActionTitle,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      weeklyGoalId: selectedWeeklyGoalId,
      startDate: actionStartDate,
      dueDate: actionEndDate,
      isAction: true,
    };

    addTask(newAction);
    
    toast({
      title: "Action added",
      description: "Your new action has been added successfully",
    });
    
    resetForm();
  };
  
  const resetForm = () => {
    setNewActionTitle('');
    setSelectedWeeklyGoalId('');
    setActionStartDate(new Date());
    setActionEndDate(addDays(new Date(), 7));
    setIsAddActionOpen(false);
  };
  
  // Toggle task details expansion
  const toggleTaskDetails = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };
  
  if (!goal) {
    return <div className="text-muted-foreground text-center py-4">Goal not found</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Actions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8" 
          onClick={() => setIsAddActionOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Action
        </Button>
      </div>
      
      <div className="space-y-2">
        {goalActions.length > 0 ? (
          goalActions.map(action => (
            <div key={action.id} className="rounded-md border mb-2">
              <div 
                className="flex items-start p-2 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
                onClick={() => toggleTaskDetails(action.id)}
              >
                <Checkbox 
                  checked={action.completed}
                  className="mt-0.5 mr-2"
                  onCheckedChange={() => toggleTaskCompletion(action.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{action.title}</div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    {action.startDate && action.dueDate && (
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {format(new Date(action.startDate), 'MMM d')} - {format(new Date(action.dueDate), 'MMM d')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {expandedTaskId === action.id && (
                <div className="p-2 bg-muted/20 text-xs border-t">
                  <Tabs defaultValue="milestones" value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="w-full grid grid-cols-4 h-8">
                      <TabsTrigger value="milestones" className="text-[10px]">Milestones</TabsTrigger>
                      <TabsTrigger value="plans" className="text-[10px]">Plans</TabsTrigger>
                      <TabsTrigger value="tasks" className="text-[10px]">Tasks</TabsTrigger>
                      <TabsTrigger value="habits" className="text-[10px]">Habits</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="milestones" className="p-2">
                      {/* Show milestones associated with this action */}
                      <p className="text-muted-foreground">Associated milestones will appear here.</p>
                    </TabsContent>
                    
                    <TabsContent value="plans" className="p-2">
                      {/* Show plans associated with this action */}
                      <p className="text-muted-foreground">Associated plans will appear here.</p>
                    </TabsContent>
                    
                    <TabsContent value="tasks" className="p-2">
                      {/* Show tasks associated with this action */}
                      <p className="text-muted-foreground">Associated tasks will appear here.</p>
                    </TabsContent>
                    
                    <TabsContent value="habits" className="p-2">
                      {/* Show habits associated with this action */}
                      <p className="text-muted-foreground">Associated habits will appear here.</p>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No actions created yet. Add one to get started.
          </div>
        )}
      </div>
      
      {/* Add Action Dialog */}
      <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Action for {goal.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="action-title">Action Name</Label>
              <Input
                id="action-title"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
                placeholder="Enter action title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-select">Associated Plan</Label>
              <Select 
                value={selectedWeeklyGoalId} 
                onValueChange={setSelectedWeeklyGoalId}
              >
                <SelectTrigger id="plan-select">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {getWeeklyGoalsForGoal().map(weeklyGoal => (
                    <SelectItem key={weeklyGoal.id} value={weeklyGoal.id}>{weeklyGoal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(actionStartDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={actionStartDate}
                      onSelect={(date) => date && setActionStartDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(actionEndDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={actionEndDate}
                      onSelect={(date) => date && setActionEndDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddActionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAction}>Add Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionsSection;
