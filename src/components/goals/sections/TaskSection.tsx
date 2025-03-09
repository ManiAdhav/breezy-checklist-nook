
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskSectionProps {
  goalId: string;
}

// Placeholder data for demonstration
const demoTasks = [
  { 
    id: 't1', 
    title: 'Set up study environment', 
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    completed: true,
    priority: 'high' as const
  },
  { 
    id: 't2', 
    title: 'Complete first chapter exercises', 
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
    completed: false,
    priority: 'medium' as const
  },
  { 
    id: 't3', 
    title: 'Schedule weekly review sessions', 
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 
    completed: false,
    priority: 'low' as const
  },
];

const TaskSection: React.FC<TaskSectionProps> = ({ goalId }) => {
  const [tasks, setTasks] = useState(demoTasks);
  
  const getPriorityClasses = (priority: 'high' | 'medium' | 'low' | 'none') => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };
  
  const toggleTaskStatus = (id: string) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };
  
  const moveTask = (id: string, direction: 'up' | 'down') => {
    const index = tasks.findIndex(t => t.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === tasks.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTasks = [...tasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
    setTasks(newTasks);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Actionable steps to achieve your goal</p>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <p className="text-muted-foreground mb-2">No tasks yet</p>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div 
              key={task.id}
              className="flex items-start p-3 border border-border rounded-md bg-card"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 mr-2 rounded-full ${
                  task.completed ? 'text-green-500' : 'text-gray-500'
                }`}
                onClick={() => toggleTaskStatus(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 fill-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityClasses(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1 mr-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  disabled={index === 0}
                  onClick={() => moveTask(task.id, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  disabled={index === tasks.length - 1}
                  onClick={() => moveTask(task.id, 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
