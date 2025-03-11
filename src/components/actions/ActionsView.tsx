
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useTask } from '@/contexts/TaskContext';
import { Plus, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';
import { toast } from '@/hooks/use-toast';

const ActionsView: React.FC = () => {
  const { threeYearGoals } = useGoal();
  const { tasks, addTask, toggleTaskCompletion } = useTask();
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(new Date());
  
  // Filter tasks that are actions
  const actions = tasks.filter(task => task.isAction);
  
  const handleAddAction = async () => {
    if (!newActionTitle.trim()) {
      toast({
        title: "Error",
        description: "Action title is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGoalId) {
      toast({
        title: "Error",
        description: "Please select a goal for this action",
        variant: "destructive",
      });
      return;
    }

    const newAction: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newActionTitle,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      startDate: actionStartDate,
      dueDate: actionEndDate,
      isAction: true,
    };

    try {
      await addTask(newAction);
      
      toast({
        title: "Action added",
        description: "Your new action has been added successfully",
      });
      
      resetForm();
    } catch (error) {
      console.error("Error adding action:", error);
      toast({
        title: "Error",
        description: "Failed to add action",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setNewActionTitle('');
    setSelectedGoalId('');
    setActionStartDate(new Date());
    setActionEndDate(new Date());
    setIsAddActionOpen(false);
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Actions</h1>
        <Button 
          onClick={() => setIsAddActionOpen(true)}
          variant="action"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Action
        </Button>
      </div>
      
      <div className="grid gap-4">
        {actions.length > 0 ? (
          actions.map(action => (
            <div 
              key={action.id} 
              className="flex items-start p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <Checkbox 
                checked={action.completed}
                className="mt-1 mr-3"
                onCheckedChange={() => toggleTaskCompletion(action.id)}
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-lg">{action.title}</h3>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  {action.startDate && action.dueDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>
                        {format(new Date(action.startDate), 'MMM d')} - {format(new Date(action.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  {action.weeklyGoalId && (
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1.5" />
                      <span>
                        {/* Display associated goal name here */}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <h3 className="font-medium mb-2">No actions yet</h3>
            <p className="text-muted-foreground mb-4">Create your first action to track progress on your goals</p>
            <Button 
              onClick={() => setIsAddActionOpen(true)}
              variant="outline"
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Action
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Action</DialogTitle>
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
              <Label htmlFor="goal-select">Map to Goal</Label>
              <Select 
                value={selectedGoalId} 
                onValueChange={setSelectedGoalId}
              >
                <SelectTrigger id="goal-select">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {threeYearGoals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddActionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAction}>Create Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionsView;
