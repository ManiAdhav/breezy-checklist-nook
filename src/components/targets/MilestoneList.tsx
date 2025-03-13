import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { NinetyDayTarget, ThreeYearGoal, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Plus, Target, MoreHorizontal, CalendarClock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MilestoneForm from './MilestoneForm';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MilestoneListProps {
  user?: any;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ user }) => {
  const { ninetyDayTargets, threeYearGoals, deleteNinetyDayTarget, updateNinetyDayTarget } = useGoal();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<NinetyDayTarget | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTargets = ninetyDayTargets.filter(target =>
    target.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddMilestone = async () => {
    setIsFormOpen(true);
  };
  
  const handleDeleteMilestone = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        // Delete from local state
        deleteNinetyDayTarget(id);
        
        // If user is logged in, save the action to Supabase
        if (user) {
          await supabase.from('user_entries').insert({
            user_id: user.id,
            content: JSON.stringify({ action: 'delete', target_id: id }),
            entry_type: 'milestone_delete',
          });
          
          toast({
            title: 'Milestone deleted',
            description: 'Your milestone was deleted and the change was synced to the cloud',
          });
        }
      } catch (error) {
        console.error('Error deleting milestone:', error);
        toast({
          title: 'Error',
          description: 'There was a problem deleting your milestone',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleEditMilestone = (target: NinetyDayTarget) => {
    setEditingTarget(target);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTarget(null);
  };
  
  const handleStatusChange = async (target: NinetyDayTarget, newStatus: GoalStatus) => {
    try {
      // Update local state
      updateNinetyDayTarget(target.id, { status: newStatus });
      
      // If user is logged in, save to Supabase
      if (user) {
        await supabase.from('user_entries').insert({
          user_id: user.id,
          content: JSON.stringify({
            action: 'update_status',
            target_id: target.id,
            new_status: newStatus
          }),
          entry_type: 'milestone_status_update',
        });
        
        toast({
          title: 'Milestone status updated',
          description: 'The status was updated and synced to the cloud',
        });
      }
    } catch (error) {
      console.error('Error updating milestone status:', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating the status',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex flex-col flex-1 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">90-Day Targets</h2>
        <Button onClick={handleAddMilestone}>
          <Plus className="w-4 h-4 mr-2" />
          Add Target
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Input
          type="search"
          placeholder="Search milestones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {filteredTargets.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-muted-foreground">No milestones yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTargets.map((target) => {
            const parentGoal = threeYearGoals.find(goal => goal.id === target.threeYearGoalId);
            
            return (
              <div key={target.id} className="bg-card rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{target.title}</h3>
                    {parentGoal && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Part of: {parentGoal.title}
                      </p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMilestone(target)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteMilestone(target.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {target.description && (
                  <p className="text-sm text-muted-foreground mb-3">{target.description}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <p>
                    {format(new Date(target.startDate), 'MMM d')} - {format(new Date(target.endDate), 'MMM d')}
                  </p>
                  
                  <select
                    value={target.status}
                    onChange={(e) => handleStatusChange(target, e.target.value as GoalStatus)}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-xs"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <MilestoneForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingTarget={editingTarget}
        user={user}
      />
    </div>
  );
};

export default MilestoneList;
