
import React from 'react';
import { Target, Search } from 'lucide-react';
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
  // Extract search term without the command prefix
  const searchTerm = inputValue.includes('/') ? inputValue.split('/').pop() || '' : '';
  
  return (
    <div 
      className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-xl shadow-medium border border-border/40"
      ref={commandRef}
    >
      <Command className="rounded-lg">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="w-4 h-4 mr-2 text-muted-foreground" />
          <CommandInput 
            placeholder="Search goals..." 
            value={searchTerm}
            className="h-9 border-none focus:ring-0 bg-transparent"
          />
        </div>
        <CommandList className="max-h-[240px] overflow-auto">
          <CommandEmpty>
            <div className="py-4 text-center text-sm text-muted-foreground">
              No matching goals found
            </div>
          </CommandEmpty>
          
          <CommandGroup heading="Goals">
            {filteredGoals.map(goal => (
              <CommandItem 
                key={goal.id}
                onSelect={() => onGoalSelect(goal.id, goal.title)}
                className="cursor-pointer flex items-center px-3 py-2.5 hover:bg-primary/5"
              >
                <Target className="w-4 h-4 mr-2 text-primary" />
                <span className="flex-1 truncate">{goal.title}</span>
                <span className="text-xs text-muted-foreground ml-2">Tab to select</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandMenuPopup;
