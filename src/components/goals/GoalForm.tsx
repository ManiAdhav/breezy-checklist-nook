
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal: ThreeYearGoal | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, editingGoal }) => {
  const { addThreeYearGoal, updateThreeYearGoal } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)); // 3 years from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  
  // Reset form when dialog opens/closes or editing goal changes
  useEffect(() => {
    if (isOpen) {
      if (editingGoal) {
        setTitle(editingGoal.title);
        setDescription(editingGoal.description || '');
        setStartDate(new Date(editingGoal.startDate));
        setEndDate(new Date(editingGoal.endDate));
        setStatus(editingGoal.status);
      } else {
        setTitle('');
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000));
        setStatus('not_started');
      }
    }
  }, [isOpen, editingGoal]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const goalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      status
    };
    
    if (editingGoal) {
      updateThreeYearGoal(editingGoal.id, goalData);
    } else {
      addThreeYearGoal(goalData);
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
          <DialogTitle>{editingGoal ? 'Edit Three-Year Goal' : 'Add Three-Year Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <Input
              placeholder="Goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
              autoFocus
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
              {editingGoal ? 'Save' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;
