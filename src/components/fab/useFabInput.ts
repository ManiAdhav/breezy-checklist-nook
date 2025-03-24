
import { useState, useEffect } from 'react';
import { Goals } from '@/types/task';
import { parseNaturalLanguageTask } from '@/utils/dateParser';

interface UseFabInputProps {
  threeYearGoals: Goals[];
}

// Function to perform fuzzy matching
const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;
  
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  
  // Simple matching - checks if query is a substring of text
  if (normalizedText.includes(normalizedQuery)) return true;
  
  // More advanced fuzzy matching - handles typos and variations
  let textIndex = 0;
  let queryIndex = 0;
  
  while (textIndex < normalizedText.length && queryIndex < normalizedQuery.length) {
    if (normalizedText[textIndex] === normalizedQuery[queryIndex]) {
      queryIndex++;
    }
    textIndex++;
  }
  
  // If we went through the entire query, it's a match
  return queryIndex === normalizedQuery.length;
};

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
  
  // Detect any slash in the input to show command menu
  useEffect(() => {
    // Check if there's a slash in the input and no goal is selected yet
    if (inputValue.includes('/') && !selectedGoalTitle) {
      setShowCommandMenu(true);
      
      // Extract the search term after the last slash
      const searchTerms = inputValue.split('/');
      const searchTerm = searchTerms[searchTerms.length - 1].trim().toLowerCase();
      
      // Filter goals using fuzzy search
      const filtered = threeYearGoals.filter(goal => 
        fuzzyMatch(goal.title, searchTerm)
      );
      
      setFilteredGoals(filtered);
    } else {
      // Close the command menu if there's no slash or a goal has been selected
      if (!inputValue.includes('/') || selectedGoalTitle) {
        setShowCommandMenu(false);
      }
    }
  }, [inputValue, threeYearGoals, selectedGoalTitle]);
  
  // Parse the input value on change
  useEffect(() => {
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
  
  const handleGoalSelect = (goalId: string, goalTitle: string) => {
    // Extract the task description without any command
    let taskText = inputValue;
    
    // Remove any command parts (text after the slash)
    if (inputValue.includes('/')) {
      taskText = inputValue.split('/')[0].trim();
    }
    
    setInputValue(taskText);
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
