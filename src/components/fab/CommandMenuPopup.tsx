
import React, { useRef, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Goals } from '@/types/task';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface CommandMenuPopupProps {
  inputValue: string;
  filteredGoals: Goals[];
  onGoalSelect: (goalId: string, goalTitle: string) => void;
  commandRef: React.RefObject<HTMLDivElement>;
}

const CommandMenuPopup: React.FC<CommandMenuPopupProps> = ({
  inputValue,
  filteredGoals,
  onGoalSelect,
  commandRef,
}) => {
  // Extract search term without the /g command
  const searchTerm = inputValue.replace(/^\/g\s*/i, '');
  
  return (
    <div 
      className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-md shadow-lg border"
      ref={commandRef}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search goals..." 
          value={searchTerm}
          onValueChange={(value) => {
            // This is handled by the parent component
          }}
          className="h-9"
        />
        <CommandList>
          <CommandEmpty>
            No matching goals found
          </CommandEmpty>
          
          <CommandGroup heading="Goals">
            {filteredGoals.map(goal => (
              <CommandItem 
                key={goal.id}
                onSelect={() => onGoalSelect(goal.id, goal.title)}
                className="cursor-pointer"
              >
                <Target className="w-4 h-4 mr-2 text-primary" />
                {goal.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandMenuPopup;
