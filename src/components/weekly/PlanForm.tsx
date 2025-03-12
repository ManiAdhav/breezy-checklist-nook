import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useGoal } from '@/contexts/GoalContext';
import { Plan, GoalStatus } from '@/types/task';
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

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: Plan | null;
  currentWeekStart: Date;
  currentWeekEnd: Date;
}

const PlanForm: React.FC<PlanFormProps> = ({ 
  isOpen, 
  onClose, 
  editingPlan,
  currentWeekStart,
  currentWeekEnd
}) => {
  const { addPlan, updatePlan, ninetyDayTargets } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [ninetyDayTargetId, setNinetyDayTargetId] = useState('');
  
  // States for controlling date popovers
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(currentWeekStart);
  const [endDate, setEndDate] = useState<Date>(currentWeekEnd);
  
  // Reset form when editingPlan changes
  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setDescription(editingPlan.description || '');
      setStatus(editingPlan.status);
      setNinetyDayTargetId(editingPlan.ninetyDayTargetId);
      setStartDate(new Date(editingPlan.startDate));
      setEndDate(new Date(editingPlan.endDate));
    } else {
      setTitle('');
      setDescription('');
      setStatus('not_started');
      setStartDate(currentWeekStart);
      setEndDate(currentWeekEnd);
      setNinetyDayTargetId(ninetyDayTargets.length > 0 ? ninetyDayTargets[0].id : '');
    }
  }, [editingPlan, ninetyDayTargets, currentWeekStart, currentWeekEnd]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      title,
      description: description || undefined,
      status,
      startDate,
      endDate,
      ninetyDayTargetId,
    };
    
    if (editingPlan && editingPlan.id !== 'temp') {
      updatePlan(editingPlan.id, planData);
    } else {
      addPlan(planData);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? 'Edit Plan' : 'Add Plan'}
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
                placeholder="Plan title"
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
              placeholder="Enter plan description"
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
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanForm;
