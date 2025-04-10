
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoal } from '@/contexts/GoalContext';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

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
  const [name, setName] = React.useState('');
  const [metric, setMetric] = React.useState('');
  const [goalId, setGoalId] = React.useState('none');
  
  // Reset form when dialog opens/closes or editing habit changes
  React.useEffect(() => {
    if (open) {
      if (editHabit) {
        setName(editHabit.name);
        setMetric(editHabit.metric);
        setGoalId(editHabit.goalId || 'none');
      } else {
        setName('');
        setMetric('');
        setGoalId('none');
      }
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
          tags: []
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
                <SelectItem value="none">None</SelectItem>
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
