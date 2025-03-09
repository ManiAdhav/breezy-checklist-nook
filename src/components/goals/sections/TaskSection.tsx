
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskSectionProps {
  goalId: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | 'none';
}

const TaskSection: React.FC<TaskSectionProps> = ({ goalId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date>(new Date());
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low' | 'none'>('medium');
  
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

  const openCreateTaskDialog = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDueDate(new Date());
    setTaskPriority('medium');
    setIsTaskDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(new Date(task.dueDate));
    setTaskPriority(task.priority);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id 
            ? { 
                ...task, 
                title: taskTitle, 
                dueDate: taskDueDate, 
                priority: taskPriority 
              }
            : task
        )
      );
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: taskTitle,
        dueDate: taskDueDate,
        completed: false,
        priority: taskPriority
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast({
        title: "Task created",
        description: "Your new task has been created",
      });
    }
    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
      variant: "destructive",
    });
  };
  
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
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <p className="text-muted-foreground mb-2">No tasks yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openCreateTaskDialog}
          >
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
                  <DropdownMenuItem onClick={() => openEditTaskDialog(task)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="task-due-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(taskDueDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={taskDueDate}
                    onSelect={(date) => date && setTaskDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select 
                value={taskPriority} 
                onValueChange={(value) => setTaskPriority(value as 'high' | 'medium' | 'low' | 'none')}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskSection;
