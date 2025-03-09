
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Calendar, Clock, Save } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { parseNaturalLanguageTask } from '@/utils/dateParser';
import { Priority } from '@/types/task';
import { toast } from '@/hooks/use-toast';

const FloatingActionButton: React.FC = () => {
  const { addTask } = useTask();
  const [isOpen, setIsOpen] = useState(false);
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
    // Focus the input when the FAB is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
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
      // Add recurring information if available
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
    setIsOpen(false);
  };
  
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2" 
      ref={fabRef}
    >
      {isOpen && (
        <div className="mb-4 w-[300px] bg-white rounded-xl shadow-lg border border-border animate-scale-in">
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border-b border-border pb-2 mb-4 focus:outline-none focus:border-primary"
              placeholder="Add a task... (e.g., 'Call John tomorrow at 3pm')"
            />
            
            {parsedTask.title && (
              <div className="text-sm">
                <div className="font-medium">{parsedTask.title}</div>
                {parsedTask.dueDate && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{format(parsedTask.dueDate, 'PPP')}</span>
                    {parsedTask.dueDate.getHours() !== 0 && (
                      <>
                        <Clock className="w-4 h-4 ml-2 mr-1" />
                        <span>{format(parsedTask.dueDate, 'p')}</span>
                      </>
                    )}
                  </div>
                )}
                {parsedTask.recurring && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-2">
                    Recurring: {parsedTask.recurringPattern}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t border-border p-2 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
              disabled={!parsedTask.title}
            >
              <Save className="w-4 h-4 mr-1" />
              Save Task
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-destructive text-destructive-foreground rotate-45' 
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingActionButton;
