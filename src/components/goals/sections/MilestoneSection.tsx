
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMilestones } from './milestones/useMilestones';
import MilestoneItem from './milestones/MilestoneItem';
import MilestoneDialog from './milestones/MilestoneDialog';
import EmptyMilestones from './milestones/EmptyMilestones';

interface MilestoneSectionProps {
  goalId: string;
  limit?: number;
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ goalId, limit }) => {
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
  
  // Apply limit if specified
  const displayMilestones = limit ? goalMilestones.slice(0, limit) : goalMilestones;
  const hasMoreMilestones = limit && goalMilestones.length > limit;
  
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
          {displayMilestones.map(milestone => (
            <MilestoneItem 
              key={milestone.id}
              milestone={milestone}
              toggleMilestoneStatus={toggleMilestoneStatus}
              onEdit={openEditMilestoneDialog}
              onDelete={handleDeleteMilestone}
              getStatusClasses={getStatusClasses}
            />
          ))}
          {hasMoreMilestones && (
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              +{goalMilestones.length - limit} more milestones
            </Button>
          )}
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
