
import React from 'react';
import { Goals, GoalStatus } from '@/types/task';
import TitleField from './form-fields/TitleField';
import DescriptionField from './form-fields/DescriptionField';
import DatePickerField from './form-fields/DatePickerField';
import StatusField from './form-fields/StatusField';
import GoalSelectorField from './form-fields/GoalSelectorField';
import FormActions from './form-fields/FormActions';

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
  threeYearGoals: Goals[];
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
        <GoalSelectorField 
          goals={threeYearGoals}
          selectedGoalId={threeYearGoalId}
          setSelectedGoalId={setThreeYearGoalId}
        />
        
        <TitleField
          title={title}
          setTitle={setTitle}
          placeholder="Milestone title"
        />
        
        <DescriptionField
          description={description}
          setDescription={setDescription}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            label="Start Date"
            date={startDate}
            setDate={setStartDate}
            isOpen={startDateOpen}
            setIsOpen={setStartDateOpen}
          />
          
          <DatePickerField
            label="End Date"
            date={endDate}
            setDate={setEndDate}
            isOpen={endDateOpen}
            setIsOpen={setEndDateOpen}
          />
          
          <StatusField
            status={status}
            setStatus={setStatus}
          />
        </div>
      </div>
      
      <FormActions
        onCancel={onClose}
        isEditing={isEditing}
        submitLabel={isEditing ? 'Save Milestone' : 'Add Milestone'}
      />
    </form>
  );
};

export default MilestoneFormContent;
