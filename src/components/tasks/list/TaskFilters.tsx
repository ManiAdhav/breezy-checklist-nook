
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

interface TaskFiltersProps {
  showFilters: boolean;
  activeFilters: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  showFilters, 
  activeFilters 
}) => {
  const {
    searchQuery,
    setSearchQuery,
    setSortBy,
    setShowCompleted
  } = useTask();

  const clearFilters = () => {
    setSearchQuery('');
    setShowCompleted(true);
    setSortBy('createdAt');
  };

  if (!showFilters) return null;

  return (
    <div className="space-y-2 px-6 pb-2">
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
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
