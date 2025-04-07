
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import TagBadge from '@/components/tags/TagBadge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, lists, customLists } = useTask();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };
  
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getListName = (listId: string): string => {
    // Check built-in lists
    const builtInList = lists.find(list => list.id === listId);
    if (builtInList) return builtInList.name;
    
    // Check custom lists
    const customList = customLists.find(list => list.id === listId);
    if (customList) return customList.name;
    
    return '';
  };

  return (
    <div 
      className={cn(
        "flex flex-col border-b border-border py-3 px-2 hover:bg-accent/10 rounded-md transition-colors duration-150",
        task.completed && "opacity-70"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1 mr-3" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={`transition-transform ${task.completed ? 'checkbox-animation' : ''}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            "font-medium text-sm",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </div>
          
          <div className="flex flex-wrap items-center mt-1 text-[0.65rem] text-muted-foreground">
            {task.listId && (
              <>
                <span className="flex items-center text-[0.65rem]">
                  {getListName(task.listId)}
                </span>
                {(task.dueDate || task.priority !== 'none') && <span className="mx-1.5 text-gray-300">|</span>}
              </>
            )}
            
            {task.dueDate && (
              <>
                <span className="text-[0.65rem]">
                  {format(new Date(task.dueDate), 'dd-MM-yy')}
                </span>
                {task.priority !== 'none' && <span className="mx-1.5 text-gray-300">|</span>}
              </>
            )}
            
            {task.priority !== 'none' && (
              <div className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className="capitalize">{task.priority}</span>
              </div>
            )}
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap mt-2">
              {task.tags.map(tagId => (
                <TagBadge key={tagId} tagId={tagId} />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-60" />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
