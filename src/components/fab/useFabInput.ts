import { useState, useEffect } from 'react';
import { Goals } from '@/types/task';
import { parseNaturalLanguageTask } from '@/utils/dateParser';

interface UseFabInputProps {
  threeYearGoals: Goals[];
}

export const useFabInput = ({ threeYearGoals }: UseFabInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState<string | null>(null);
  const [filteredGoals, setFilteredGoals] = useState<Goals[]>([]);
  
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
  
  // Filter goals based on user input after /g command
  useEffect(() => {
    const gCommandRegex = /^\/g\s+(.+)$/i;
    const match = inputValue.match(gCommandRegex);
    
    if (match) {
      const searchTerm = match[1].toLowerCase();
      setShowCommandMenu(true);
      const filtered = threeYearGoals.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm)
      );
      setFilteredGoals(filtered);
    } else if (inputValue === '/g' || inputValue === '/g ') {
      setShowCommandMenu(true);
      setFilteredGoals(threeYearGoals);
    } else {
      setShowCommandMenu(false);
    }
  }, [inputValue, threeYearGoals]);
  
  // Parse the input value on change
  useEffect(() => {
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
  
  const handleGoalSelect = (goalId: string, goalTitle: string) => {
    // Extract the task title without the /g command
    const originalTaskText = inputValue.replace(/^\/g\s+.+$/i, '').trim();
    
    // If there's a task description first, keep it, otherwise just clear the command
    const updatedInputValue = originalTaskText || '';
    
    setInputValue(updatedInputValue);
    setSelectedGoalId(goalId);
    setSelectedGoalTitle(goalTitle);
    setShowCommandMenu(false);
  };
  
  return {
    inputValue,
    setInputValue,
    showCommandMenu,
    setShowCommandMenu,
    selectedGoalId,
    setSelectedGoalId,
    selectedGoalTitle,
    setSelectedGoalTitle,
    filteredGoals,
    parsedTask,
    handleGoalSelect
  };
};
