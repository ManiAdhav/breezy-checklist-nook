
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Import the refactored components and hook
import { useTaskSection } from './tasks/useTaskSection';
import EmptyTaskState from './tasks/EmptyTaskState';
import TaskItem from './tasks/TaskItem';
import TaskDialog from './tasks/TaskDialog';

interface TaskSectionProps {
  goalId: string;
}

const TaskSection: React.FC<TaskSectionProps> = ({ goalId }) => {
  const {
    tasks,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    editingTask,
    taskTitle,
    setTaskTitle,
    taskDueDate,
    setTaskDueDate,
    taskPriority,
    setTaskPriority,
    getPriorityClasses,
    toggleTaskStatus,
    moveTask,
    openCreateTaskDialog,
    openEditTaskDialog,
    handleSaveTask,
    handleDeleteTask
  } = useTaskSection(goalId);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Actionable steps to achieve your goal</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={openCreateTaskDialog}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      {tasks.length === 0 ? (
        <EmptyTaskState onAddTask={openCreateTaskDialog} />
      ) : (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <TaskItem 
              key={task.id}
              task={task}
              index={index}
              totalTasks={tasks.length}
              toggleTaskStatus={toggleTaskStatus}
              moveTask={moveTask}
              onEdit={openEditTaskDialog}
              onDelete={handleDeleteTask}
              getPriorityClasses={getPriorityClasses}
            />
          ))}
        </div>
      )}

      {/* Task Dialog */}
      <TaskDialog 
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        title={taskTitle}
        setTitle={setTaskTitle}
        dueDate={taskDueDate}
        setDueDate={setTaskDueDate}
        priority={taskPriority}
        setPriority={setTaskPriority}
        onSave={handleSaveTask}
        isEditing={!!editingTask}
      />
    </div>
  );
};

export default TaskSection;
