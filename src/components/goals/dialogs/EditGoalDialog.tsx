
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { useGoal } from '@/hooks/useGoalContext';
import { toast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Target, Flag, ListChecks, Repeat, Calendar, Star, Heart, Key, Clock, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditGoalDialogProps {
  goal: ThreeYearGoal;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, isOpen, onOpenChange }) => {
  const { updateThreeYearGoal } = useGoal();
  
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStartDate, setEditedStartDate] = useState<Date>(new Date());
  const [editedEndDate, setEditedEndDate] = useState<Date>(new Date());
  const [editedStatus, setEditedStatus] = useState<GoalStatus>('not_started');
  const [editedIcon, setEditedIcon] = useState('');
  
  const iconOptions = [
    { value: 'Target', icon: Target },
    { value: 'Flag', icon: Flag },
    { value: 'ListChecks', icon: ListChecks },
    { value: 'Repeat', icon: Repeat },
    { value: 'Calendar', icon: Calendar },
    { value: 'Star', icon: Star },
    { value: 'Heart', icon: Heart },
    { value: 'Key', icon: Key },
    { value: 'Clock', icon: Clock },
    { value: 'MapPin', icon: MapPin },
  ];
  
  // Get the icon component based on the goal's icon value
  const getIcon = (iconName: string | undefined) => {
    const icon = iconOptions.find(opt => opt.value === iconName);
    return icon ? icon.icon : Target;
  };
  
  useEffect(() => {
    if (isOpen && goal) {
      setEditedTitle(goal.title);
      setEditedDescription(goal.description || '');
      setEditedStartDate(new Date(goal.startDate));
      setEditedEndDate(new Date(goal.endDate));
      setEditedStatus(goal.status);
      setEditedIcon(goal.icon || 'Target');
    }
  }, [isOpen, goal]);
  
  const handleSaveGoal = () => {
    if (!editedTitle.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }

    updateThreeYearGoal(goal.id, {
      title: editedTitle,
      description: editedDescription,
      startDate: editedStartDate,
      endDate: editedEndDate,
      status: editedStatus,
      icon: editedIcon
    });

    toast({
      title: "Goal updated",
      description: "Your goal has been updated successfully",
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {React.createElement(getIcon(editedIcon), { className: "h-5 w-5 text-primary mr-2" })}
            <span>Edit Goal</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter goal title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter goal description"
              className="min-h-24 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={editedIcon === option.value ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-10 w-10",
                      editedIcon === option.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setEditedIcon(option.value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{option.value}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="goal-start-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(editedStartDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editedStartDate}
                    onSelect={(date) => date && setEditedStartDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-end-date">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="goal-end-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(editedEndDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editedEndDate}
                    onSelect={(date) => date && setEditedEndDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-status">Status</Label>
            <Select 
              value={editedStatus} 
              onValueChange={(value) => setEditedStatus(value as GoalStatus)}
            >
              <SelectTrigger id="goal-status">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGoal}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;
