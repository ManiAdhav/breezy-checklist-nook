
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

interface MilestoneSectionProps {
  goalId: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ goalId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState<Date>(new Date());
  const [milestoneStatus, setMilestoneStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  
  const getStatusClasses = (status: 'not_started' | 'in_progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  const toggleMilestoneStatus = (id: string) => {
    setMilestones(prev => 
      prev.map(milestone => {
        if (milestone.id === id) {
          const newStatus = 
            milestone.status === 'not_started' ? 'in_progress' :
            milestone.status === 'in_progress' ? 'completed' : 'not_started';
          
          return { ...milestone, status: newStatus };
        }
        return milestone;
      })
    );
  };

  const openCreateMilestoneDialog = () => {
    setEditingMilestone(null);
    setMilestoneTitle('');
    setMilestoneDate(new Date());
    setMilestoneStatus('not_started');
    setIsMilestoneDialogOpen(true);
  };

  const openEditMilestoneDialog = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setMilestoneTitle(milestone.title);
    setMilestoneDate(new Date(milestone.targetDate));
    setMilestoneStatus(milestone.status);
    setIsMilestoneDialogOpen(true);
  };

  const handleSaveMilestone = () => {
    if (!milestoneTitle.trim()) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      });
      return;
    }

    if (editingMilestone) {
      // Update existing milestone
      setMilestones(prevMilestones => 
        prevMilestones.map(milestone => 
          milestone.id === editingMilestone.id 
            ? { ...milestone, title: milestoneTitle, targetDate: milestoneDate, status: milestoneStatus }
            : milestone
        )
      );
      toast({
        title: "Milestone updated",
        description: "Your milestone has been updated successfully",
      });
    } else {
      // Create new milestone
      const newMilestone: Milestone = {
        id: `m${Date.now()}`,
        title: milestoneTitle,
        targetDate: milestoneDate,
        status: milestoneStatus
      };
      setMilestones(prevMilestones => [...prevMilestones, newMilestone]);
      toast({
        title: "Milestone created",
        description: "Your new milestone has been created",
      });
    }
    setIsMilestoneDialogOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prevMilestones => prevMilestones.filter(milestone => milestone.id !== id));
    toast({
      title: "Milestone deleted",
      description: "Your milestone has been deleted",
      variant: "destructive",
    });
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
      
      {milestones.length === 0 ? (
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
          {milestones.map(milestone => (
            <div 
              key={milestone.id}
              className="flex items-start p-3 border border-border rounded-md bg-card"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 mr-2 rounded-full ${
                  milestone.status === 'completed' ? 'text-green-500' :
                  milestone.status === 'in_progress' ? 'text-blue-500' : 'text-gray-500'
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
                
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Target: {format(new Date(milestone.targetDate), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClasses(milestone.status)}`}>
                    {milestone.status === 'not_started' ? 'Not Started' :
                     milestone.status === 'in_progress' ? 'In Progress' : 'Completed'}
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
              <Label htmlFor="milestone-date">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="milestone-date"
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
              <Label htmlFor="milestone-status">Status</Label>
              <Select 
                value={milestoneStatus} 
                onValueChange={(value) => setMilestoneStatus(value as 'not_started' | 'in_progress' | 'completed')}
              >
                <SelectTrigger id="milestone-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
