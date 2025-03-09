
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { NinetyDayTarget, GoalStatus, ThreeYearGoal } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface NinetyDayTargetFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTarget: NinetyDayTarget | null;
}

const NinetyDayTargetForm: React.FC<NinetyDayTargetFormProps> = ({ isOpen, onClose, editingTarget }) => {
  const { addNinetyDayTarget, updateNinetyDayTarget, threeYearGoals } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [threeYearGoalId, setThreeYearGoalId] = useState<string>('');
  
  // Reset form when dialog opens/closes or editing target changes
  useEffect(() => {
    if (isOpen) {
      if (editingTarget) {
        setTitle(editingTarget.title);
        setDescription(editingTarget.description || '');
        setStartDate(new Date(editingTarget.startDate));
        setEndDate(new Date(editingTarget.endDate));
        setStatus(editingTarget.status);
        setThreeYearGoalId(editingTarget.threeYearGoalId);
      } else {
        setTitle('');
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
        setStatus('not_started');
        // Set default parent goal if available
        if (threeYearGoals.length > 0) {
          setThreeYearGoalId(threeYearGoals[0].id);
        } else {
          setThreeYearGoalId('');
        }
      }
    }
  }, [isOpen, editingTarget, threeYearGoals]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !threeYearGoalId) return;
    
    const targetData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      status,
      threeYearGoalId
    };
    
    if (editingTarget) {
      updateNinetyDayTarget(editingTarget.id, targetData);
    } else {
      addNinetyDayTarget(targetData);
    }
    
    onClose();
  };
  
  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'abandoned', label: 'Abandoned' }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{editingTarget ? 'Edit 90-Day Target' : 'Add 90-Day Target'}</DialogTitle>
          <DialogDescription>
            90-day targets help break down your three-year goals into manageable chunks.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Parent Three-Year Goal</div>
              <Select
                value={threeYearGoalId}
                onValueChange={setThreeYearGoalId}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a three-year goal" />
                </SelectTrigger>
                <SelectContent>
                  {threeYearGoals.map((goal: ThreeYearGoal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Input
              placeholder="Target title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
              autoFocus
              required
            />
            
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none"
            />
            
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Start Date</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[180px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">End Date</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[180px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as GoalStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTarget ? 'Save' : 'Add Target'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NinetyDayTargetForm;
