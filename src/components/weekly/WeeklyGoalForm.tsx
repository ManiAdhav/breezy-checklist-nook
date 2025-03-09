
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useGoal } from '@/contexts/GoalContext';
import { WeeklyGoal, GoalStatus } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WeeklyGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal: WeeklyGoal | null;
  currentWeekStart: Date;
  currentWeekEnd: Date;
}

const WeeklyGoalForm: React.FC<WeeklyGoalFormProps> = ({ 
  isOpen, 
  onClose, 
  editingGoal,
  currentWeekStart,
  currentWeekEnd
}) => {
  const { addWeeklyGoal, updateWeeklyGoal, ninetyDayTargets } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [ninetyDayTargetId, setNinetyDayTargetId] = useState('');
  
  // Reset form when editingGoal changes
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setStatus(editingGoal.status);
      setNinetyDayTargetId(editingGoal.ninetyDayTargetId);
    } else {
      setTitle('');
      setDescription('');
      setStatus('not_started');
      setNinetyDayTargetId(ninetyDayTargets.length > 0 ? ninetyDayTargets[0].id : '');
    }
  }, [editingGoal, ninetyDayTargets]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title,
      description: description || undefined,
      status,
      startDate: currentWeekStart,
      endDate: currentWeekEnd,
      ninetyDayTargetId,
    };
    
    if (editingGoal && editingGoal.id !== 'temp') {
      updateWeeklyGoal(editingGoal.id, goalData);
    } else {
      addWeeklyGoal(goalData);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Edit Weekly Goal' : 'Add Weekly Goal'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter goal description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetId">90-Day Target</Label>
            <Select
              value={ninetyDayTargetId}
              onValueChange={setNinetyDayTargetId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a 90-day target" />
              </SelectTrigger>
              <SelectContent>
                {ninetyDayTargets.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as GoalStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label>Date Range</Label>
            <div className="text-sm text-muted-foreground">
              {format(currentWeekStart, 'MMM d, yyyy')} - {format(currentWeekEnd, 'MMM d, yyyy')}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyGoalForm;
