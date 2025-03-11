
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';

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
  
  // States for controlling date popovers
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(currentWeekStart);
  const [endDate, setEndDate] = useState<Date>(currentWeekEnd);
  
  // Reset form when editingGoal changes
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setStatus(editingGoal.status);
      setNinetyDayTargetId(editingGoal.ninetyDayTargetId);
      setStartDate(new Date(editingGoal.startDate));
      setEndDate(new Date(editingGoal.endDate));
    } else {
      setTitle('');
      setDescription('');
      setStatus('not_started');
      setStartDate(currentWeekStart);
      setEndDate(currentWeekEnd);
      setNinetyDayTargetId(ninetyDayTargets.length > 0 ? ninetyDayTargets[0].id : '');
    }
  }, [editingGoal, ninetyDayTargets, currentWeekStart, currentWeekEnd]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title,
      description: description || undefined,
      status,
      startDate,
      endDate,
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
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-md pointer-events-none"
              >
                <CheckSquare className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly goal title"
                className="text-lg"
                required
              />
            </div>
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
