
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Priority } from '@/types/task';
import { TitleField, DueDateField, PriorityField } from '@/components/tasks/form';

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  dueDate: Date;
  setDueDate: (date: Date) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  onSave: () => void;
  isEditing: boolean;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  setTitle,
  dueDate,
  setDueDate,
  priority,
  setPriority,
  onSave,
  isEditing
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <TitleField title={title} setTitle={setTitle} />
          <DueDateField dueDate={dueDate} setDueDate={setDueDate} />
          <PriorityField priority={priority} setPriority={setPriority} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
