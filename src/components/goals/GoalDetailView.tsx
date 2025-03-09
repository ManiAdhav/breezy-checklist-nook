
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { format } from 'date-fns';
import { 
  Calendar, 
  Target, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Circle,
  Plus,
  Flag,
  ListChecks,
  Repeat,
  ArrowLeft,
  Edit,
  Star,
  Heart,
  Key,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MilestoneSection from './sections/MilestoneSection';
import PlanSection from './sections/PlanSection';
import TaskSection from './sections/TaskSection';
import HabitSection from './sections/HabitSection';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface GoalDetailViewProps {
  goalId: string;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goalId, onBack }) => {
  const { threeYearGoals, updateThreeYearGoal } = useGoal();
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  const [openSections, setOpenSections] = useState({
    milestones: true,
    plans: true,
    tasks: true,
    habits: false,
  });

  // Edit goal state
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStartDate, setEditedStartDate] = useState<Date>(new Date());
  const [editedEndDate, setEditedEndDate] = useState<Date>(new Date());
  const [editedStatus, setEditedStatus] = useState<GoalStatus>('not_started');
  const [editedIcon, setEditedIcon] = useState('');
  
  // Simple progress calculation for demo purposes
  // In a real app, this would be calculated based on milestones, tasks, etc.
  const progressPercentage = 
    goal?.status === 'completed' ? 100 :
    goal?.status === 'in_progress' ? 65 : // Example value
    goal?.status === 'not_started' ? 0 : 5;
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };
  
  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: 'bg-gray-500',
      in_progress: 'bg-primary',
      completed: 'bg-green-500',
      abandoned: 'bg-red-500',
    };
    return colors[status];
  };
  
  const handleStatusUpdate = (status: GoalStatus) => {
    if (!goal) return;
    
    updateThreeYearGoal(goal.id, { status });
    
    toast({
      title: "Goal status updated",
      description: `Status changed to ${getStatusLabel(status)}`,
    });
  };

  const openEditGoalDialog = () => {
    if (!goal) return;
    
    setEditedTitle(goal.title);
    setEditedDescription(goal.description || '');
    setEditedStartDate(new Date(goal.startDate));
    setEditedEndDate(new Date(goal.endDate));
    setEditedStatus(goal.status);
    setEditedIcon(goal.icon || 'Target');
    setIsEditGoalDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (!goal) return;
    
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
    
    setIsEditGoalDialogOpen(false);
  };

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
  
  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Target className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Goal not found</h2>
        <p className="text-muted-foreground mb-4">The goal you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack}>Back to Goals</Button>
      </div>
    );
  }
  
  // Format dates for display
  const startDate = format(new Date(goal.startDate), 'MMM d, yyyy');
  const endDate = format(new Date(goal.endDate), 'MMM d, yyyy');
  
  // Get the icon component based on the goal's icon value
  const getIcon = (iconName: string | undefined) => {
    const icon = iconOptions.find(opt => opt.value === iconName);
    return icon ? icon.icon : Target;
  };
  
  const GoalIcon = getIcon(goal.icon);
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background shadow-sm z-10">
        <Button variant="ghost" onClick={onBack} className="mr-2 hover:bg-background">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight flex items-center">
            <GoalIcon className="h-5 w-5 mr-2 text-primary" />
            {goal.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
            {startDate} - {endDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={openEditGoalDialog}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <div className="flex items-center">
            <select 
              value={goal.status}
              onChange={(e) => handleStatusUpdate(e.target.value as GoalStatus)}
              className="text-sm border border-input rounded-md px-3 py-1.5 bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Goal Description and Progress */}
        <div className="p-6 border-b border-border bg-card/50">
          <div className="mb-5">
            {goal.description && (
              <p className="text-muted-foreground">{goal.description}</p>
            )}
          </div>
          
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">Goal Progress</h3>
              <span className="text-sm font-semibold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2.5" />
            
            <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1.5 ${getStatusColor(goal.status)}`}></div>
                <span>{getStatusLabel(goal.status)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sections */}
        <div className="divide-y divide-border">
          {/* Milestones Section */}
          <Collapsible 
            open={openSections.milestones}
            onOpenChange={() => toggleSection('milestones')}
            className="px-6 py-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group">
              <div className="flex items-center">
                <Flag className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Milestones</h3>
              </div>
              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
                {openSections.milestones ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <MilestoneSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Plans Section */}
          <Collapsible 
            open={openSections.plans}
            onOpenChange={() => toggleSection('plans')}
            className="px-6 py-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Plans</h3>
              </div>
              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
                {openSections.plans ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <PlanSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Tasks Section */}
          <Collapsible 
            open={openSections.tasks}
            onOpenChange={() => toggleSection('tasks')}
            className="px-6 py-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group">
              <div className="flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Tasks</h3>
              </div>
              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
                {openSections.tasks ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <TaskSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Habits Section */}
          <Collapsible 
            open={openSections.habits}
            onOpenChange={() => toggleSection('habits')}
            className="px-6 py-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group">
              <div className="flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Habits</h3>
              </div>
              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
                {openSections.habits ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <HabitSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
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
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(editedStartDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editedStartDate}
                      onSelect={(date) => date && setEditedStartDate(date)}
                      initialFocus
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
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(editedEndDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editedEndDate}
                      onSelect={(date) => date && setEditedEndDate(date)}
                      initialFocus
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
            <Button variant="outline" onClick={() => setIsEditGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-md bg-primary hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default GoalDetailView;
