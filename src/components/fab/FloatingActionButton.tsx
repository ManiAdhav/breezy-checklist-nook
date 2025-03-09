
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { parseNaturalLanguageTask } from '@/utils/dateParser';
import { Priority } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const FloatingActionButton: React.FC = () => {
  const { addTask } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
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
  
  useEffect(() => {
    // Parse the input value on change
    if (inputValue.trim()) {
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
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };
  
  const handleSave = () => {
    if (!parsedTask.title.trim()) {
      toast({
        title: "Task required",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }
    
    addTask({
      title: parsedTask.title,
      completed: false,
      dueDate: parsedTask.dueDate,
      priority: 'none' as Priority,
      listId: 'inbox',
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
  
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
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
          <div className="w-full flex items-center p-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border-none focus:ring-0 h-10 text-sm"
              placeholder="Add a task... (e.g., 'Call John tomorrow at 3pm')"
              autoFocus
            />
            
            <button
              onClick={handleSave}
              className={`
                ml-2 rounded-full p-2 transition-all duration-300
                ${inputValue.trim() ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400'}
              `}
              disabled={!inputValue.trim()}
            >
              <Save className="w-4 h-4" />
            </button>
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
      {isExpanded && parsedTask.dueDate && (
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
