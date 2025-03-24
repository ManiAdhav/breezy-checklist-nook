
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
  TitleField, 
  DueDateField, 
  PriorityField, 
  ListField, 
  NotesField 
} from './form/TaskFormFields';
import GoalSelectorField from '@/components/targets/form-fields/GoalSelectorField';
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
            <TitleField title={title} setTitle={setTitle} />
            
            <div className="grid grid-cols-2 gap-4">
              <DueDateField dueDate={dueDate} setDueDate={setDueDate} />
              <PriorityField priority={priority} setPriority={setPriority} />
            </div>
            
            <ListField 
              listId={listId} 
              setListId={setListId} 
              allLists={allLists} 
            />
            
            <GoalSelectorField
              goals={threeYearGoals}
              selectedGoalId={selectedGoalId}
              setSelectedGoalId={setSelectedGoalId}
            />
            
            <NotesField notes={notes} setNotes={setNotes} />
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
