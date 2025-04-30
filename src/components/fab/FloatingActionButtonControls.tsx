
import React from 'react';
import { Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SelectedGoalBadge from './SelectedGoalBadge';
import CommandMenuPopup from './CommandMenuPopup';

interface FloatingActionButtonControlsProps {
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  showCommandMenu: boolean;
  selectedGoalTitle: string | null;
  handleSave: () => void;
  isCalendarPage: boolean;
  filteredGoals: any[];
  handleGoalSelect: (goalId: string, goalTitle: string) => void;
  commandRef: React.RefObject<HTMLDivElement>;
}

const FloatingActionButtonControls: React.FC<FloatingActionButtonControlsProps> = ({
  inputRef,
  inputValue,
  setInputValue,
  handleKeyDown,
  showCommandMenu,
  selectedGoalTitle,
  handleSave,
  isCalendarPage,
  filteredGoals,
  handleGoalSelect,
  commandRef
}) => {
  // Determine if we are in command mode (when "/" is typed)
  const isCommandMode = inputValue.includes('/') && !selectedGoalTitle;
  
  return (
    <div className="w-full flex items-center p-3 relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full border-none focus:ring-0 h-11 rounded-lg ${isCommandMode ? 'bg-secondary/50' : ''}`}
        placeholder={isCalendarPage 
          ? "Add a task for this date... (Type / to use commands)" 
          : "Add a task... (Type / to use commands)"}
        autoFocus
      />
      
      <SelectedGoalBadge goalTitle={selectedGoalTitle || ''} />
      
      <button
        onClick={handleSave}
        className={`
          ml-2 rounded-full p-2 transition-all duration-300
          ${inputValue.trim() && !showCommandMenu ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-muted-foreground'}
        `}
        disabled={!inputValue.trim() || showCommandMenu}
      >
        <Save className="w-5 h-5" />
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
  );
};

export default FloatingActionButtonControls;
