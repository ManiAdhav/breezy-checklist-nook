
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
  return (
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
  );
};

export default FloatingActionButtonControls;
