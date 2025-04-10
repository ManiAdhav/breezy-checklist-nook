
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TagSelector from '@/components/tags/TagSelector';
import { useGoal } from '@/contexts/GoalContext';
import { useTask } from '@/contexts/TaskContext';
import { generateId } from '@/utils/taskUtils';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdded: (habitId: string) => void;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ open, onOpenChange, onHabitAdded }) => {
  const { goals } = useGoal();
  const { tags } = useTask();
  
  const [name, setName] = useState('');
  const [metricType, setMetricType] = useState<'count' | 'duration' | 'boolean'>('count');
  const [metricUnit, setMetricUnit] = useState('times');
  const [metricTarget, setMetricTarget] = useState(1);
  const [goalId, setGoalId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setMetricType('count');
    setMetricUnit('times');
    setMetricTarget(1);
    setGoalId(undefined);
    setSelectedTagIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new habit with the form values
    const newHabit = {
      id: generateId(),
      name,
      metric: {
        type: metricType,
        unit: metricUnit,
        target: metricTarget
      },
      goalId,
      tags: selectedTagIds,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add the habit to the database or state
    // For now, just call onHabitAdded with the new habit ID
    onHabitAdded(newHabit.id);
    
    // Reset the form and close the dialog
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">What habit do you want to track?</Label>
            <Input
              id="habit-name"
              placeholder="e.g., Drink water, Meditate, Exercise..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>How do you want to measure this habit?</Label>
            <Select value={metricType} onValueChange={(value: 'count' | 'duration' | 'boolean') => setMetricType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select measurement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count (e.g., glasses of water)</SelectItem>
                <SelectItem value="duration">Duration (e.g., minutes meditated)</SelectItem>
                <SelectItem value="boolean">Completion (e.g., did it or not)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {metricType !== 'boolean' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metric-target">Daily Target</Label>
                <Input
                  id="metric-target"
                  type="number"
                  min="1"
                  value={metricTarget}
                  onChange={(e) => setMetricTarget(parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metric-unit">Unit</Label>
                <Input
                  id="metric-unit"
                  placeholder="e.g., glasses, minutes, times"
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="goal-id">Link to Goal (Optional)</Label>
            <Select value={goalId || ""} onValueChange={setGoalId}>
              <SelectTrigger id="goal-id">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {goals?.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector
              selectedTagIds={selectedTagIds}
              onTagsChange={setSelectedTagIds}
              enableAutoCreate={true}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
