
import React from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { useTask } from '@/contexts/TaskContext';
import TaskItemHeader from './item/TaskItemHeader';
import TaskItemMetadata from './item/TaskItemMetadata';
import TaskItemTags from './item/TaskItemTags';
import TaskItemNotes from './item/TaskItemNotes';
import TaskItemActions from './item/TaskItemActions';
import TaskCompletionToggle from './item/TaskCompletionToggle';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();
  
  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-400';
      case 'low':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Debug info for the task
  const showTaskInfo = () => {
    console.log('Task details:', task);
    alert(`Task ID: ${task.id}\nList ID: ${task.listId}\nCreated: ${task.createdAt}\nTags: ${task.tags?.join(', ') || 'None'}`);
  };
  
  return (
    <div 
      className={cn(
        "p-2 flex items-start rounded-md border border-border mb-1.5 transition-all",
        "hover:bg-accent/10 relative group",
        task.completed && "bg-accent/5 opacity-75"
      )}
    >
      <TaskCompletionToggle 
        completed={task.completed} 
        toggleTaskCompletion={toggleTaskCompletion} 
        taskId={task.id} 
      />
      
      <div className="flex-1 min-w-0">
        <TaskItemHeader 
          title={task.title} 
          listId={task.listId} 
          completed={task.completed} 
          showTaskInfo={showTaskInfo} 
        />
        
        <TaskItemMetadata 
          dueDate={task.dueDate} 
          priority={task.priority} 
          taskId={task.id} 
          getPriorityColor={getPriorityColor} 
        />
        
        <TaskItemTags tags={task.tags} />
        
        <TaskItemNotes notes={task.notes} />
      </div>
      
      <TaskItemActions 
        onEdit={onEdit} 
        deleteTask={deleteTask} 
        task={task} 
      />
    </div>
  );
};

export default TaskItem;
