
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Circle, Calendar, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGoal } from '@/hooks/useGoalContext';
import { NinetyDayTarget, GoalStatus } from '@/types/task';

interface MilestoneSectionProps {
  goalId: string;
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ goalId }) => {
  const { ninetyDayTargets, updateNinetyDayTarget, addNinetyDayTarget, deleteNinetyDayTarget } = useGoal();
  
  // Filter milestones (90-day targets) related to this goal
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<NinetyDayTarget | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState<Date>(new Date());
  const [milestoneEndDate, setMilestoneEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const [milestoneStatus, setMilestoneStatus] = useState<GoalStatus>('not_started');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  
  const getStatusClasses = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100';
      case 'abandoned':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  const toggleMilestoneStatus = (id: string) => {
    const milestone = ninetyDayTargets.find(target => target.id === id);
    if (!milestone) return;
    
    const newStatus = 
      milestone.status === 'not_started' ? 'in_progress' :
      milestone.status === 'in_progress' ? 'completed' : 'not_started';
    
    updateNinetyDayTarget(id, { status: newStatus });
    
    toast({
      title: "Milestone status updated",
      description: `Milestone is now ${newStatus.replace('_', ' ')}`,
    });
  };

  const openCreateMilestoneDialog = () => {
    setEditingMilestone(null);
    setMilestoneTitle('');
    setMilestoneDescription('');
    setMilestoneDate(new Date());
    setMilestoneEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setMilestoneStatus('not_started');
    setIsMilestoneDialogOpen(true);
  };

  const openEditMilestoneDialog = (milestone: NinetyDayTarget) => {
    setEditingMilestone(milestone);
    setMilestoneTitle(milestone.title);
    setMilestoneDescription(milestone.description || '');
    setMilestoneDate(new Date(milestone.startDate));
    setMilestoneEndDate(new Date(milestone.endDate));
    setMilestoneStatus(milestone.status);
    setIsMilestoneDialogOpen(true);
  };

  const handleSaveMilestone = async () => {
    if (!milestoneTitle.trim()) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingMilestone) {
        // Update existing milestone
        await updateNinetyDayTarget(editingMilestone.id, {
          title: milestoneTitle,
          description: milestoneDescription || undefined,
          startDate: milestoneDate,
          endDate: milestoneEndDate,
          status: milestoneStatus
        });
        
        toast({
          title: "Milestone updated",
          description: "Your milestone has been updated successfully",
        });
      } else {
        // Create new milestone
        await addNinetyDayTarget({
          title: milestoneTitle,
          description: milestoneDescription || undefined,
          startDate: milestoneDate,
          endDate: milestoneEndDate,
          status: milestoneStatus,
          threeYearGoalId: goalId
        });
        
        toast({
          title: "Milestone created",
          description: "Your new milestone has been created",
        });
      }
      
      setIsMilestoneDialogOpen(false);
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your milestone",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      await deleteNinetyDayTarget(id);
      
      toast({
        title: "Milestone deleted",
        description: "Your milestone has been deleted",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting your milestone",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Key checkpoints for your goal</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={openCreateMilestoneDialog}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>
      
      {goalMilestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <p className="text-muted-foreground mb-2">No milestones yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openCreateMilestoneDialog}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Milestone
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {goalMilestones.map(milestone => (
            <div 
              key={milestone.id}
              className="flex items-start p-3 border border-border rounded-md bg-card"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 mr-2 rounded-full ${
                  milestone.status === 'completed' ? 'text-green-500' :
                  milestone.status === 'in_progress' ? 'text-blue-500' : 
                  milestone.status === 'abandoned' ? 'text-red-500' : 'text-gray-500'
                }`}
                onClick={() => toggleMilestoneStatus(milestone.id)}
              >
                {milestone.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 fill-green-500" />
                ) : milestone.status === 'in_progress' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {milestone.title}
                </div>
                
                {milestone.description && (
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {milestone.description}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {format(new Date(milestone.startDate), 'MMM d, yyyy')} - {format(new Date(milestone.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClasses(milestone.status)}`}>
                    {milestone.status === 'not_started' ? 'Not Started' :
                     milestone.status === 'in_progress' ? 'In Progress' :
                     milestone.status === 'completed' ? 'Completed' : 'Abandoned'}
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditMilestoneDialog(milestone)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteMilestone(milestone.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Milestone Dialog */}
      <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMilestone ? 'Edit Milestone' : 'Create New Milestone'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="milestone-title">Title</Label>
              <Input
                id="milestone-title"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                placeholder="Enter milestone title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="milestone-description">Description (Optional)</Label>
              <Input
                id="milestone-description"
                value={milestoneDescription}
                onChange={(e) => setMilestoneDescription(e.target.value)}
                placeholder="Enter milestone description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="milestone-start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="milestone-start-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(milestoneDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={milestoneDate}
                    onSelect={(date) => date && setMilestoneDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="milestone-end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="milestone-end-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(milestoneEndDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={milestoneEndDate}
                    onSelect={(date) => date && setMilestoneEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="milestone-status">Status</Label>
              <Select 
                value={milestoneStatus} 
                onValueChange={(value) => setMilestoneStatus(value as GoalStatus)}
              >
                <SelectTrigger id="milestone-status">
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
            <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMilestone}>
              {editingMilestone ? 'Save Changes' : 'Create Milestone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestoneSection;
