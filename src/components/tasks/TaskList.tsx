
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Task } from '@/types/task';
import TaskListHeader from './list/TaskListHeader';
import TaskFilters from './list/TaskFilters';
import EmptyTaskList from './list/EmptyTaskList';
import TaskDateHeader from './list/TaskDateHeader';

const TaskList: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    selectedListId,
    lists,
    customLists,
    sortBy,
    showCompleted,
    searchQuery
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

  // Calculate active filters
  const activeFilters = [];
  if (selectedListId !== 'all') activeFilters.push(getSelectedListName());
  if (sortBy !== 'createdAt') activeFilters.push(`Sorted by ${sortBy}`);
  if (!showCompleted) activeFilters.push('Hiding completed');
  if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TaskListHeader 
        getSelectedListName={getSelectedListName}
        activeFilters={activeFilters}
        handleAddTask={handleAddTask}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      <TaskFilters 
        showFilters={showFilters} 
        activeFilters={activeFilters} 
      />
      
      <div className="flex-1 overflow-y-auto px-6">
        {filteredTasks.length === 0 ? (
          <EmptyTaskList handleAddTask={handleAddTask} />
        ) : (
          <div className="space-y-1">
            <TaskDateHeader 
              selectedListId={selectedListId} 
              title={selectedListId === 'today' ? 'Today' : 'Upcoming'} 
            />
            
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
