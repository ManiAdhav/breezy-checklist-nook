
import React from 'react';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Target } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { milestoneStatusOptions } from './constants/status-options';

interface MilestoneFormContentProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  status: GoalStatus;
  setStatus: (status: GoalStatus) => void;
  threeYearGoalId: string;
  setThreeYearGoalId: (id: string) => void;
  startDateOpen: boolean;
  setStartDateOpen: (open: boolean) => void;
  endDateOpen: boolean;
  setEndDateOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
  threeYearGoals: ThreeYearGoal[];
}

const MilestoneFormContent: React.FC<MilestoneFormContentProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  threeYearGoalId,
  setThreeYearGoalId,
  startDateOpen,
  setStartDateOpen,
  endDateOpen,
  setEndDateOpen,
  handleSubmit,
  onClose,
  isEditing,
  threeYearGoals
}) => {
  return (
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
                {milestoneStatusOptions.map((option) => (
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
          {isEditing ? 'Save' : 'Add Milestone'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MilestoneFormContent;
