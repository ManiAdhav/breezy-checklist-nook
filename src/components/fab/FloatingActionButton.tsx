
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Priority } from '@/types/task';
import CommandMenuPopup from './CommandMenuPopup';
import TaskPreview from './TaskPreview';
import SelectedGoalBadge from './SelectedGoalBadge';
import { useFabInput } from './useFabInput';

const FloatingActionButton: React.FC = () => {
  const location = useLocation();
  const { addTask } = useTask();
  const { threeYearGoals } = useGoal();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  
  const {
    inputValue,
    setInputValue,
    showCommandMenu,
    setShowCommandMenu,
    selectedGoalId,
    selectedGoalTitle,
    filteredGoals,
    parsedTask,
    handleGoalSelect
  } = useFabInput({ threeYearGoals });
  
  // Determine if we're on the calendar page
  const isCalendarPage = location.pathname.includes('calendar');
  
  useEffect(() => {
    // Focus the input when the FAB is expanded
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() && !showCommandMenu) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setShowCommandMenu(false);
    } else if (e.key === 'Tab' && showCommandMenu && filteredGoals.length > 0) {
      e.preventDefault();
      handleGoalSelect(filteredGoals[0].id, filteredGoals[0].title);
    } else if (e.key === 'ArrowDown' && showCommandMenu) {
      e.preventDefault();
      const commandList = document.querySelector('[cmdk-list]');
      const firstItem = commandList?.querySelector('[cmdk-item]') as HTMLElement;
      if (firstItem) firstItem.focus();
    }
  };
  
  const handleSave = () => {
    // Don't save if showing command menu
    if (showCommandMenu) return;
    
    // Handle /g command format
    if (inputValue.startsWith('/g')) {
      toast({
        title: "Invalid input",
        description: "Please select a goal from the list",
        variant: "destructive",
      });
      return;
    }
    
    if (!parsedTask.title.trim()) {
      toast({
        title: "Task required",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }
    
    addTask({
      title: selectedGoalTitle 
        ? `${parsedTask.title} (${selectedGoalTitle})` 
        : parsedTask.title,
      completed: false,
      dueDate: parsedTask.dueDate,
      priority: 'none' as Priority,
      listId: 'inbox',
      goalId: selectedGoalId || undefined,
      notes: parsedTask.recurring 
        ? `Recurring: ${parsedTask.recurringPattern}` 
        : undefined,
    });
    
    toast({
      title: "Task added",
      description: "Your task was added successfully",
    });
    
    // Reset the input and close the FAB
    setInputValue('');
    setIsExpanded(false);
  };
  
  // Adjusted styles for calendar page if needed
  const fabPosition = isCalendarPage 
    ? "fixed bottom-6 right-6 z-50 transition-all duration-300"
    : "fixed bottom-6 right-6 z-50 transition-all duration-300";
  
  return (
    <div 
      className={fabPosition}
      style={{ width: isExpanded ? 'calc(100% - 88px)' : 'auto', maxWidth: isExpanded ? '900px' : 'auto' }}
      ref={fabRef}
    >
      <div 
        className={`
          transition-all duration-300 overflow-hidden
          ${isExpanded 
            ? 'w-full rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]' 
            : 'w-12 h-12 rounded-full bg-[#F5F5F5] hover:bg-[#EEEEEE] shadow-[0_2px_5px_rgba(0,0,0,0.08)]'}
          flex items-center 
        `}
      >
        {isExpanded ? (
          <div className="w-full flex items-center p-2 relative">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border-none focus:ring-0 h-10 text-sm"
              placeholder={isCalendarPage 
                ? "Add a task for this date... (Type /g to select a goal)" 
                : "Add a task... (Type /g to select a goal)"}
              autoFocus
            />
            
            <SelectedGoalBadge goalTitle={selectedGoalTitle || ''} />
            
            <button
              onClick={handleSave}
              className={`
                ml-2 rounded-full p-2 transition-all duration-300
                ${inputValue.trim() && !showCommandMenu ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400'}
              `}
              disabled={!inputValue.trim() || showCommandMenu}
            >
              <Save className="w-4 h-4" />
            </button>
            
            {showCommandMenu && (
              <CommandMenuPopup 
                inputValue={inputValue}
                filteredGoals={filteredGoals}
                onGoalSelect={handleGoalSelect}
                commandRef={commandRef}
              />
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors rounded-full"
            aria-label="Add new task"
          >
            <Plus className="w-5 h-5 text-[#333333]" />
          </button>
        )}
      </div>
      
      {/* Task preview when date/time is detected */}
      {isExpanded && parsedTask.dueDate && !showCommandMenu && (
        <TaskPreview 
          dueDate={parsedTask.dueDate}
          recurring={parsedTask.recurring}
          recurringPattern={parsedTask.recurringPattern}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
