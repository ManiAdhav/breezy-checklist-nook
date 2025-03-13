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
import { cn } from '@/lib/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTarget: NinetyDayTarget | null;
  user?: any; // Add user prop
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ isOpen, onClose, editingTarget, user }) => {
  const { addNinetyDayTarget, updateNinetyDayTarget, threeYearGoals } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [threeYearGoalId, setThreeYearGoalId] = useState<string>('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      // Update local state
      let targetId;
      
      if (editingTarget) {
        updateNinetyDayTarget(editingTarget.id, targetData);
        targetId = editingTarget.id;
      } else {
        const newTarget = await addNinetyDayTarget(targetData);
        targetId = newTarget?.id;
      }
      
      // If user is logged in, save to Supabase
      if (user && targetId) {
        await supabase.from('user_entries').insert({
          user_id: user.id,
          content: JSON.stringify({
            action: editingTarget ? 'update' : 'create',
            target_id: targetId,
            target_data: targetData
          }),
          entry_type: editingTarget ? 'milestone_update' : 'milestone_create',
        });
        
        toast({
          title: editingTarget ? 'Milestone updated' : 'Milestone created',
          description: 'Your changes were saved and synced to the cloud',
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your milestone',
        variant: 'destructive',
      });
    }
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
          <DialogTitle>{editingTarget ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
          <DialogDescription>
            Milestones help break down your three-year goals into manageable chunks.
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
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-md pointer-events-none"
                >
                  <Target className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1">
                <Input
                  placeholder="Milestone title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                  autoFocus
                  required
                />
              </div>
            </div>
            
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Start Date</div>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'PPP')}
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">End Date</div>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'PPP')}
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
                  <SelectTrigger className="w-full">
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
              {editingTarget ? 'Save' : 'Add Milestone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneForm;
