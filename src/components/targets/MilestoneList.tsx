
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { GoalStatus, NinetyDayTarget } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MilestoneForm from './MilestoneForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useMilestoneFilters } from './hooks/useMilestoneFilters';
import MilestoneFilters from './MilestoneFilters';
import MilestoneGrid from './MilestoneGrid';

interface MilestoneListProps {
  user?: any;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ user }) => {
  const { ninetyDayTargets, threeYearGoals, deleteNinetyDayTarget, updateNinetyDayTarget } = useGoal();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<NinetyDayTarget | null>(null);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    filteredTargets
  } = useMilestoneFilters({ milestones: ninetyDayTargets });
  
  const handleAddMilestone = () => {
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
      
      <MilestoneFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
      />
      
      <MilestoneGrid
        filteredTargets={filteredTargets}
        threeYearGoals={threeYearGoals}
        onEdit={handleEditMilestone}
        onDelete={handleDeleteMilestone}
        onStatusChange={handleStatusChange}
        user={user}
      />
      
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
