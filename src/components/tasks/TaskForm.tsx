
import React from 'react';
import { Task } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTaskForm } from './form/useTaskForm';
import { 
  MinimalTitleField, 
  MinimalDueDateField, 
  MinimalPriorityField, 
  MinimalListField, 
  MinimalNotesField,
  MinimalTagsField,
  RecurringOptionField
} from './form/TaskFormFields';
import MinimalGoalSelectorField from '@/components/targets/form-fields/MinimalGoalSelectorField';
import { useGoal } from '@/contexts/GoalContext';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask: Task | null;
  defaultDueDate?: Date;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  editingTask,
  defaultDueDate 
}) => {
  const { threeYearGoals } = useGoal();
  const {
    title,
    setTitle,
    notes,
    setNotes,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    listId,
    setListId,
    selectedGoalId,
    setSelectedGoalId,
    selectedTagIds,
    setSelectedTagIds,
    recurring,
    setRecurring,
    recurringPattern,
    setRecurringPattern,
    isSubmitting,
    handleSubmit,
    allLists,
    isEditing
  } = useTaskForm({ editingTask, defaultDueDate, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <MinimalTitleField title={title} setTitle={setTitle} />
            
            <div className="flex flex-wrap gap-3 items-center">
              <MinimalDueDateField dueDate={dueDate} setDueDate={setDueDate} />
              <MinimalPriorityField priority={priority} setPriority={setPriority} />
              <MinimalListField listId={listId} setListId={setListId} allLists={allLists} />
              <MinimalGoalSelectorField
                goals={threeYearGoals}
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
              />
            </div>
            
            <RecurringOptionField 
              recurring={recurring}
              setRecurring={setRecurring}
              recurringPattern={recurringPattern}
              setRecurringPattern={setRecurringPattern}
            />
            
            <MinimalTagsField
              selectedTagIds={selectedTagIds}
              setSelectedTagIds={setSelectedTagIds}
            />
            
            <MinimalNotesField notes={notes} setNotes={setNotes} />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
