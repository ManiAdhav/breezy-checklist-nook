
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, SortAsc, Check, Calendar, Flag, AlignLeft, Clock, ChevronDown, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Task } from '@/types/task';

const TaskList: React.FC = () => {
  const {
    filteredTasks,
    selectedListId,
    lists,
    customLists,
    setSortBy,
    sortBy,
    showCompleted,
    setShowCompleted
  } = useTask();
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const getSelectedListName = () => {
    const allLists = [...lists, ...customLists];
    const list = allLists.find(list => list.id === selectedListId);
    return list?.name || 'Tasks';
  };
  
  const incompleteTasks = filteredTasks.filter(task => !task.completed).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-6 px-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="font-bold text-xl">{getSelectedListName()}</h2>
            <span className="ml-2 text-sm text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
              {incompleteTasks}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <SortAsc className="h-4 w-4 mr-1" />
                  <span>Sort</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem checked={sortBy === 'dueDate'} onCheckedChange={() => setSortBy('dueDate')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Due Date</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortBy === 'priority'} onCheckedChange={() => setSortBy('priority')}>
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Priority</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortBy === 'title'} onCheckedChange={() => setSortBy('title')}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  <span>Alphabetical</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortBy === 'createdAt'} onCheckedChange={() => setSortBy('createdAt')}>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Created Date</span>
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem checked={showCompleted} onCheckedChange={setShowCompleted}>
                  <Check className="h-4 w-4 mr-2" />
                  <span>Show Completed</span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-start py-2 border border-gray-200 hover:bg-accent/10 hover:border-gray-300" 
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-sm">Add New Task</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Check className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No tasks here</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add a new task to get started or change your view settings.
            </p>
            <Button onClick={handleAddTask} className="mt-6">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Task</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </div>
        )}
      </div>
      
      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} editingTask={editingTask} />
    </div>
  );
};

export default TaskList;
