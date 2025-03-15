
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMilestones } from './milestones/useMilestones';
import MilestoneItem from './milestones/MilestoneItem';
import MilestoneDialog from './milestones/MilestoneDialog';
import EmptyMilestones from './milestones/EmptyMilestones';

interface MilestoneSectionProps {
  goalId: string;
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ goalId }) => {
  const {
    goalMilestones,
    isMilestoneDialogOpen,
    setIsMilestoneDialogOpen,
    editingMilestone,
    milestoneTitle,
    setMilestoneTitle,
    milestoneDescription,
    setMilestoneDescription,
    milestoneDate,
    setMilestoneDate,
    milestoneEndDate,
    setMilestoneEndDate,
    milestoneStatus,
    setMilestoneStatus,
    getStatusClasses,
    toggleMilestoneStatus,
    openCreateMilestoneDialog,
    openEditMilestoneDialog,
    handleSaveMilestone,
    handleDeleteMilestone
  } = useMilestones(goalId);
  
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
        <EmptyMilestones onAddMilestone={openCreateMilestoneDialog} />
      ) : (
        <div className="space-y-2">
          {goalMilestones.map(milestone => (
            <MilestoneItem 
              key={milestone.id}
              milestone={milestone}
              toggleMilestoneStatus={toggleMilestoneStatus}
              onEdit={openEditMilestoneDialog}
              onDelete={handleDeleteMilestone}
              getStatusClasses={getStatusClasses}
            />
          ))}
        </div>
      )}

      <MilestoneDialog 
        isOpen={isMilestoneDialogOpen}
        onOpenChange={setIsMilestoneDialogOpen}
        title={milestoneTitle}
        setTitle={setMilestoneTitle}
        description={milestoneDescription}
        setDescription={setMilestoneDescription}
        startDate={milestoneDate}
        setStartDate={setMilestoneDate}
        endDate={milestoneEndDate}
        setEndDate={setMilestoneEndDate}
        status={milestoneStatus}
        setStatus={setMilestoneStatus}
        onSave={handleSaveMilestone}
        isEditing={!!editingMilestone}
      />
    </div>
  );
};

export default MilestoneSection;
