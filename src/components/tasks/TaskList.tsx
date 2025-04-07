
import React, { useState, useEffect } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  SortAsc, 
  Check, 
  Calendar, 
  Flag, 
  AlignLeft, 
  Clock, 
  ChevronDown, 
  MoreVertical,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuCheckboxItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Task } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const TaskList: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    selectedListId,
    lists,
    customLists,
    setSortBy,
    sortBy,
    showCompleted,
    setShowCompleted,
    searchQuery,
    setSearchQuery
  } = useTask();
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const getSelectedListName = () => {
    if (selectedListId === 'all') return 'All Tasks';
    
    const allLists = [...lists, ...customLists];
    const list = allLists.find(list => list.id === selectedListId);
    return list?.name || 'Tasks';
  };

  // Don't show Today and Planned additional information for regular lists
  const showDateHeader = selectedListId === 'today' || selectedListId === 'planned';

  // Function to help debugging by showing all tasks
  const handleShowAllTasks = () => {
    // Log all tasks to console for debugging
    console.log('All tasks in system:', tasks);
    toast({
      title: "Tasks info",
      description: `Total tasks: ${tasks.length}, Filtered tasks: ${filteredTasks.length}`,
    });
  };

  // Calculate active filters
  const activeFilters = [];
  if (selectedListId !== 'all') activeFilters.push(getSelectedListName());
  if (sortBy !== 'createdAt') activeFilters.push(`Sorted by ${sortBy}`);
  if (!showCompleted) activeFilters.push('Hiding completed');
  if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-6 px-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="font-bold text-xl">{getSelectedListName()}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 h-8 w-8" 
              onClick={handleShowAllTasks}
              title="Show task information"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center h-8">
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
        
        {/* Search and Filters */}
        {showFilters && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs px-2"
                    onClick={() => {
                      setSearchQuery('');
                      setShowCompleted(true);
                      setSortBy('createdAt');
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
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
              {tasks.length > 0 
                ? "Try changing your filters to see more tasks."
                : "Add a new task to get started."}
            </p>
            <div className="flex mt-6 gap-2">
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Task</span>
              </Button>
              {tasks.length > 0 && (
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setShowCompleted(true);
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {showDateHeader && selectedListId === 'today' && (
              <div className="text-sm font-medium text-foreground mb-2">
                Today
              </div>
            )}
            
            {showDateHeader && selectedListId === 'planned' && (
              <div className="text-sm font-medium text-foreground mb-2">
                Upcoming
              </div>
            )}
            
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
