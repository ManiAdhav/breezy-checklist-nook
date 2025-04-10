
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoal } from '@/hooks/useGoalContext';
import { Habit } from '@/types/habit';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdded: (habit: Habit) => void;
  editHabit?: Habit;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  onHabitAdded,
  editHabit 
}) => {
  // Get goals from context
  const { threeYearGoals } = useGoal();
  
  // Form state
  const [name, setName] = React.useState('');
  const [metric, setMetric] = React.useState('');
  const [goalId, setGoalId] = React.useState('');
  
  // Reset form when dialog opens/closes or editing habit changes
  React.useEffect(() => {
    if (open) {
      if (editHabit) {
        setName(editHabit.name);
        setMetric(editHabit.metric);
        setGoalId(editHabit.goalId || '');
      } else {
        setName('');
        setMetric('');
        setGoalId('');
      }
    }
  }, [open, editHabit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !metric.trim()) return;
    
    const newHabit: Habit = {
      id: editHabit?.id || `habit-${Date.now()}`,
      name,
      metric,
      goalId: goalId || undefined,
      streak: editHabit?.streak || 0,
      created: editHabit?.created || new Date(),
      logs: editHabit?.logs || []
    };
    
    onHabitAdded(newHabit);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="What habit do you want to track?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metric">Metric</Label>
            <Input
              id="metric"
              placeholder="How will you measure this? (e.g., steps, minutes)"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">Related Goal (Optional)</Label>
            <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {threeYearGoals && threeYearGoals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {editHabit ? 'Save Changes' : 'Add Habit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
