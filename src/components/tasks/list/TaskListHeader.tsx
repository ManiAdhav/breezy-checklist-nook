
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, SortAsc, ChevronDown, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTask } from '@/contexts/TaskContext';
import { toast } from '@/hooks/use-toast';

interface TaskListHeaderProps {
  getSelectedListName: () => string;
  activeFilters: string[];
  handleAddTask: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  getSelectedListName,
  activeFilters,
  handleAddTask,
  showFilters,
  setShowFilters
}) => {
  const { 
    tasks, 
    filteredTasks,
    sortBy,
    setSortBy,
    showCompleted,
    setShowCompleted
  } = useTask();

  // Function to help debugging by showing all tasks
  const handleShowAllTasks = () => {
    // Log all tasks to console for debugging
    console.log('All tasks in system:', tasks);
    toast({
      title: "Tasks info",
      description: `Total tasks: ${tasks.length}, Filtered tasks: ${filteredTasks.length}`,
    });
  };

  return (
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

      <Button 
        variant="outline" 
        className="flex items-center justify-start py-2 border border-gray-200 hover:bg-accent/10 hover:border-gray-300" 
        onClick={handleAddTask}
      >
        <Plus className="h-4 w-4 mr-2" />
        <span className="text-sm">Add New Task</span>
      </Button>
    </div>
  );
};

export default TaskListHeader;
