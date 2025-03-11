
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useVision } from '@/contexts/VisionContext';
import { GoalStatus, Priority, ThreeYearGoal } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useTask } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';

type GoalType = 'threeYear' | 'ninetyDay';

interface MindMapGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoalType?: GoalType;
  initialGoalId?: string;
  editingGoal?: ThreeYearGoal;
  onSave?: () => void;
}

export const iconOptions = [
  { value: 'Target', label: 'Target' },
  { value: 'Award', label: 'Award' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'GraduationCap', label: 'Education' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Home', label: 'Home' },
  { value: 'Plane', label: 'Travel' },
  { value: 'Smartphone', label: 'Technology' },
  { value: 'Wallet', label: 'Finance' },
  { value: 'Smile', label: 'Lifestyle' },
  { value: 'Users', label: 'Relationships' },
  { value: 'Utensils', label: 'Food' },
  { value: 'Dumbbell', label: 'Fitness' },
  { value: 'BookOpen', label: 'Knowledge' },
];

export const statusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
];

const MindMapGoalForm: React.FC<MindMapGoalFormProps> = ({
  isOpen,
  onClose,
  initialGoalType = 'threeYear',
  initialGoalId,
  editingGoal,
  onSave,
}) => {
  const { addThreeYearGoal, updateThreeYearGoal, addNinetyDayTarget, updateNinetyDayTarget, addWeeklyGoal, } = useGoal();
  const { visions } = useVision();
  const { addTask } = useTask();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const [status, setStatus] = useState<string>('not_started');
  const [icon, setIcon] = useState<string | undefined>('Target');
  const [threeYearGoalId, setThreeYearGoalId] = useState('');
  const [actions, setActions] = useState([{ id: Date.now(), text: '' }]);
  
  // Control state for calendar popovers
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setStartDate(new Date(editingGoal.startDate));
      setEndDate(new Date(editingGoal.endDate));
      setStatus(editingGoal.status);
      setIcon(editingGoal.icon);
    } else if (initialGoalId) {
      // Fetch goal details based on initialGoalId and initialGoalType
      // For simplicity, let's assume you have functions to fetch goal details
      // and populate the form fields accordingly.
      // Example:
      // const goal = await fetchGoalDetails(initialGoalId, initialGoalType);
      // setTitle(goal.title);
      // setDescription(goal.description);
      // ...
    } else {
      resetForm();
    }
  }, [editingGoal, initialGoalId]);
  
  const getRandomIcon = () => {
    const icons = iconOptions.map(opt => opt.value);
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  const addAction = () => {
    setActions([...actions, { id: Date.now(), text: '' }]);
  };
  
  const updateAction = (id: number, text: string) => {
    setActions(actions.map(action => action.id === id ? { ...action, text } : action));
  };
  
  const removeAction = (id: number) => {
    setActions(actions.filter(action => action.id !== id));
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setStatus('not_started');
    setIcon('Target');
    setActions([{ id: Date.now(), text: '' }]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Start and end dates are required",
        variant: "destructive",
      });
      return;
    }
    
    // Check if any actions are empty
    const validActions = actions.filter(action => action.text.trim() !== '');
    
    let goalId: string | undefined;
    
    // Create the goal data
    const goalData = {
      title,
      description,
      startDate,
      endDate,
      status: status as GoalStatus,
      icon: icon || getRandomIcon(),
    };
    
    // Update or create the goal
    if (editingGoal) {
      // If we have an editingGoal, use its id
      updateThreeYearGoal(editingGoal.id, goalData);
      goalId = editingGoal.id;
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated in the mind map"
      });
    } else if (initialGoalId) {
      // For an existing goal identified by ID, update it
      if (initialGoalType === 'threeYear') {
        updateThreeYearGoal(initialGoalId, goalData);
      } else {
        updateNinetyDayTarget(initialGoalId, {
          ...goalData,
          threeYearGoalId,
        });
      }
      
      goalId = initialGoalId;
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated in the mind map"
      });
    } else {
      try {
        // For a new goal, create it
        const result = await addThreeYearGoal(goalData);
        goalId = (await result).id;
        toast({
          title: "Goal created",
          description: "Your new goal has been added to the mind map"
        });
      } catch (error) {
        console.error("Error creating goal:", error);
        toast({
          title: "Error",
          description: "Failed to create goal",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Create a weekly goal for this 3-year goal if we have a valid goal ID
    if (goalId && validActions.length > 0) {
      try {
        // Create a weekly goal to associate with the actions
        const weeklyGoalData = {
          title: `Weekly plan for ${title}`,
          description: `Initial weekly plan for achieving ${title}`,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          status: 'not_started' as GoalStatus,
          ninetyDayTargetId: "", // This would normally be set to a real 90-day target
          icon: "Target"
        };
        
        const weeklyGoalResult = await addWeeklyGoal(weeklyGoalData);
        const weeklyGoalId = (await weeklyGoalResult).id;
        
        if (weeklyGoalId) {
          // Now create tasks for each action
          for (const action of validActions) {
            await addTask({
              title: action.text,
              completed: false,
              priority: 'medium',
              listId: 'inbox',
              weeklyGoalId: weeklyGoalId,
              startDate: new Date(),
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
              isAction: true,
            });
          }
          
          toast({
            title: "Actions created",
            description: `${validActions.length} action(s) have been added to your tasks`
          });
        }
      } catch (error) {
        console.error("Error creating weekly goal or actions:", error);
        toast({
          title: "Error",
          description: "Failed to create actions",
          variant: "destructive",
        });
      }
    }
    
    // Reset form and close
    resetForm();
    if (onSave) onSave();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingGoal || initialGoalId ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-md"
                  >
                    <DynamicIcon name={icon || 'Target'} className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((iconOption) => (
                      <Button
                        key={iconOption.value}
                        variant={icon === iconOption.value ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => {
                          setIcon(iconOption.value);
                        }}
                        type="button"
                      >
                        <DynamicIcon name={iconOption.value} className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <Input
                id="goal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title"
                className="text-lg"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="goal-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="goal-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setStartDateOpen(false);
                      }
                    }}
                    disabled={date =>
                      date > (endDate ? endDate : new Date('2100-01-01'))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                        setEndDateOpen(false);
                      }
                    }}
                    disabled={date =>
                      date < (startDate ? startDate : new Date('1900-01-01'))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter goal description"
            />
          </div>
          
          <div>
            <Label>Actions</Label>
            <div className="space-y-2">
              {actions.map(action => (
                <div key={action.id} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={action.text}
                    onChange={(e) => updateAction(action.id, e.target.value)}
                    placeholder="Enter action"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAction(action.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAction}>
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingGoal || initialGoalId ? 'Update Goal' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MindMapGoalForm;
