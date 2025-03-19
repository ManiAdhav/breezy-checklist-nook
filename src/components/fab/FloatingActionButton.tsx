import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, Target } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { format } from 'date-fns';
import { parseNaturalLanguageTask } from '@/utils/dateParser';
import { Priority, ThreeYearGoal } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import CommandMenu from '@/components/command/CommandMenu';

const FloatingActionButton: React.FC = () => {
  const location = useLocation();
  const { addTask } = useTask();
  const { threeYearGoals, addThreeYearGoal } = useGoal();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState<string | null>(null);
  
  const [parsedTask, setParsedTask] = useState<{
    title: string;
    dueDate: Date | null;
    recurring: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }>({
    title: '',
    dueDate: null,
    recurring: false
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're on the calendar page
  const isCalendarPage = location.pathname.includes('calendar');
  
  // Check if input contains /g command
  useEffect(() => {
    const gCommandRegex = /^\/g\s+(.+)$/i;
    if (gCommandRegex.test(inputValue)) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  }, [inputValue]);
  
  useEffect(() => {
    // Parse the input value on change
    if (inputValue.trim() && !inputValue.startsWith('/g')) {
      const result = parseNaturalLanguageTask(inputValue);
      setParsedTask(result);
    } else {
      setParsedTask({
        title: '',
        dueDate: null,
        recurring: false
      });
    }
  }, [inputValue]);
  
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
    }
  };
  
  const handleSave = () => {
    // Don't save if showing command menu
    if (showCommandMenu) return;
    
    // Handle /g command format
    if (inputValue.startsWith('/g')) {
      toast({
        title: "Invalid input",
        description: "Please select a goal from the list or create a new one",
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
    setSelectedGoalId(null);
    setSelectedGoalTitle(null);
    setIsExpanded(false);
  };
  
  const handleGoalSelect = (goalId: string, goalTitle: string) => {
    // Extract the task title without the /g command
    const originalTaskText = inputValue.replace(/^\/g\s+.+$/i, '').trim();
    
    // If there's a task description first, keep it, otherwise just clear the command
    const updatedInputValue = originalTaskText || '';
    
    setInputValue(updatedInputValue);
    setSelectedGoalId(goalId);
    setSelectedGoalTitle(goalTitle);
    setShowCommandMenu(false);
    
    toast({
      title: "Goal selected",
      description: `Task will be associated with "${goalTitle}"`,
    });
  };
  
  const handleCreateNewGoal = async (goalTitle: string) => {
    try {
      const newGoal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'> = {
        title: goalTitle,
        status: 'active',
      };
      
      const createdGoal = await addThreeYearGoal(newGoal);
      
      // Extract the task title without the /g command
      const originalTaskText = inputValue.replace(/^\/g\s+.+$/i, '').trim();
      const updatedInputValue = originalTaskText || '';
      
      setInputValue(updatedInputValue);
      setSelectedGoalId(createdGoal.id);
      setSelectedGoalTitle(createdGoal.title);
      setShowCommandMenu(false);
      
      toast({
        title: "Goal created",
        description: `New goal "${goalTitle}" created and selected`,
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
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
            
            {selectedGoalTitle && (
              <div className="absolute top-1 right-12 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex items-center">
                <Target className="w-3 h-3 mr-1" />
                {selectedGoalTitle}
              </div>
            )}
            
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
              <CommandMenu
                isOpen={showCommandMenu}
                searchTerm={inputValue}
                onSelect={handleGoalSelect}
                onCreateNew={handleCreateNewGoal}
                onClose={() => setShowCommandMenu(false)}
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
        <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-md p-3 shadow-sm animate-fade-in absolute bottom-full mb-2 left-0 right-0">
          <div className="text-sm text-gray-500">Task will be scheduled for:</div>
          <div className="font-medium">
            {format(parsedTask.dueDate, 'PPP')}
            {parsedTask.dueDate.getHours() !== 0 && (
              <span className="ml-2">{format(parsedTask.dueDate, 'p')}</span>
            )}
          </div>
          {parsedTask.recurring && (
            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-1">
              Recurring: {parsedTask.recurringPattern}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;
