
import React from 'react';
import { NinetyDayTarget } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NinetyDayTargetFormContent from './NinetyDayTargetFormContent';
import { useNinetyDayTargetForm } from './hooks/useNinetyDayTargetForm';

interface NinetyDayTargetFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTarget: NinetyDayTarget | null;
  user?: any;
}

const NinetyDayTargetForm: React.FC<NinetyDayTargetFormProps> = ({ isOpen, onClose, editingTarget, user }) => {
  const {
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
    threeYearGoals
  } = useNinetyDayTargetForm({ editingTarget, onClose, user, isOpen });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{editingTarget ? 'Edit 90-Day Target' : 'Add 90-Day Target'}</DialogTitle>
          <DialogDescription>
            90-day targets help break down your three-year goals into manageable chunks.
          </DialogDescription>
        </DialogHeader>
        
        <NinetyDayTargetFormContent
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          status={status}
          setStatus={setStatus}
          threeYearGoalId={threeYearGoalId}
          setThreeYearGoalId={setThreeYearGoalId}
          startDateOpen={startDateOpen}
          setStartDateOpen={setStartDateOpen}
          endDateOpen={endDateOpen}
          setEndDateOpen={setEndDateOpen}
          handleSubmit={handleSubmit}
          onClose={onClose}
          isEditing={!!editingTarget}
          threeYearGoals={threeYearGoals}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NinetyDayTargetForm;
