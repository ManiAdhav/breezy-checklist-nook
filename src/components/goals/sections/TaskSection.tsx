
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
  limit?: number;
}

const TaskSection: React.FC<TaskSectionProps> = ({ goalId, limit }) => {
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
  
  // Apply limit if specified
  const displayTasks = limit ? tasks.slice(0, limit) : tasks;
  const hasMoreTasks = limit && tasks.length > limit;
  
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
          {displayTasks.map((task, index) => (
            <TaskItem 
              key={task.id}
              task={task}
              index={index}
              totalTasks={displayTasks.length}
              toggleTaskStatus={toggleTaskStatus}
              moveTask={moveTask}
              onEdit={openEditTaskDialog}
              onDelete={handleDeleteTask}
              getPriorityClasses={getPriorityClasses}
            />
          ))}
          {hasMoreTasks && (
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              +{tasks.length - limit} more tasks
            </Button>
          )}
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
