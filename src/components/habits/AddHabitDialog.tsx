
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoal } from '@/contexts/GoalContext';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

// List of common habit icons to choose from
const HABIT_ICONS = [
  'Activity', 'AlarmClock', 'Apple', 'Baby', 'Barbell', 'Bath', 'Beef',
  'Beer', 'Book', 'BrainCircuit', 'Briefcase', 'Building', 'Bus', 'Calculator',
  'Calendar', 'Camera', 'Car', 'Carrot', 'ChefHat', 'Cigarette', 'ClipboardList',
  'Clock', 'Cloud', 'Code', 'Coffee', 'Compass', 'CreditCard', 'Drumstick',
  'Dumbbell', 'Egg', 'FileText', 'Film', 'Flame', 'Gamepad2', 'Gift', 'GlassWater',
  'Globe', 'Handshake', 'Heart', 'Home', 'Laptop', 'Leaf', 'Library', 'LightbulbOff',
  'Meditation', 'Milestone', 'Microphone', 'Moon', 'Mountain', 'Bike', 'Music',
  'Newspaper', 'PaintBucket', 'Pencil', 'Pill', 'Plant', 'Running', 'School', 
  'ShoppingBag', 'ShoppingCart', 'Shower', 'Sleep', 'Smartphone', 'Smoking', 
  'SunMedium', 'Target', 'Timer', 'Trophy', 'Utensils', 'Video', 'Wallet', 
  'Water', 'Wine', 'Yoga'
];

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  editHabit 
}) => {
  // Get needed context hooks
  const { threeYearGoals } = useGoal();
  const { addHabit, updateHabit } = useHabit();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('');
  const [goalId, setGoalId] = useState('none');
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [showIconSelector, setShowIconSelector] = useState(false);
  
  // Reset form when dialog opens/closes or editing habit changes
  React.useEffect(() => {
    if (open) {
      if (editHabit) {
        setName(editHabit.name);
        setMetric(editHabit.metric);
        setGoalId(editHabit.goalId || 'none');
        setSelectedIcon(editHabit.icon || 'Activity');
      } else {
        setName('');
        setMetric('');
        setGoalId('none');
        setSelectedIcon('Activity');
      }
      setShowIconSelector(false);
    }
  }, [open, editHabit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !metric.trim()) return;
    
    try {
      if (editHabit) {
        updateHabit(editHabit.id, {
          name,
          metric,
          goalId: goalId !== 'none' ? goalId : undefined,
          icon: selectedIcon
        });
        toast({
          title: "Habit updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        addHabit({
          name,
          metric,
          goalId: goalId !== 'none' ? goalId : undefined,
          tags: [],
          icon: selectedIcon
        });
        toast({
          title: "Habit added",
          description: `${name} has been added to your habits.`
        });
      }
      
      // Reset and close
      setName('');
      setMetric('');
      setGoalId('none');
      setSelectedIcon('Activity');
      onOpenChange(false);
    } catch (error) {
      console.error('Error handling habit:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleIconSelector = () => {
    setShowIconSelector(!showIconSelector);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={toggleIconSelector}
            >
              <DynamicIcon name={selectedIcon} className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="What habit do you want to track?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          {showIconSelector && (
            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {HABIT_ICONS.map((icon) => (
                  <div
                    key={icon}
                    className={`p-2 rounded-md cursor-pointer hover:bg-primary/10 flex items-center justify-center ${
                      selectedIcon === icon ? 'bg-primary/20 ring-1 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedIcon(icon);
                      setShowIconSelector(false);
                    }}
                  >
                    <DynamicIcon name={icon} className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="metric" className="text-primary font-medium flex items-center">
              <span>Metric</span>
              <span className="ml-2 text-xs text-muted-foreground">(How will you measure this?)</span>
            </Label>
            <Input
              id="metric"
              placeholder="e.g., steps, minutes, pages, glasses"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              required
              className="border-primary/20 focus-visible:ring-primary"
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex items-center">
              <DynamicIcon name="Goal" className="h-4 w-4 mr-2 text-muted-foreground" />
              <Label htmlFor="goal" className="text-sm font-normal text-muted-foreground">Connect to Goal</Label>
            </div>
            <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
              <SelectTrigger className="bg-background border-muted">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {threeYearGoals && threeYearGoals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full mt-6">
            {editHabit ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
