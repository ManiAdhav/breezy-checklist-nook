
import React, { useRef, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Plus, Target } from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  searchTerm: string;
  onSelect: (goalId: string, goalTitle: string) => void;
  onCreateNew: (goalTitle: string) => void;
  onClose: () => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  searchTerm,
  onSelect,
  onCreateNew,
  onClose
}) => {
  const { threeYearGoals } = useGoal();
  const commandRef = useRef<HTMLDivElement>(null);
  
  const filteredTerm = searchTerm.replace(/^\/g\s*/, '').trim();
  
  const filteredGoals = threeYearGoals.filter(goal => 
    goal.title.toLowerCase().includes(filteredTerm.toLowerCase())
  );
  
  const handleClickOutside = (event: MouseEvent) => {
    if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-md shadow-lg border"
      ref={commandRef}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search goals..." 
          value={filteredTerm}
          className="h-9"
          readOnly
        />
        <CommandList>
          <CommandEmpty>
            {filteredTerm && (
              <CommandItem 
                className="flex items-center cursor-pointer hover:bg-accent" 
                onSelect={() => onCreateNew(filteredTerm)}
              >
                <Plus className="w-4 h-4 mr-2 text-primary" />
                <span>Create goal: <span className="font-medium">{filteredTerm}</span></span>
              </CommandItem>
            )}
          </CommandEmpty>
          
          <CommandGroup heading="Goals">
            {filteredGoals.map(goal => (
              <CommandItem 
                key={goal.id}
                onSelect={() => onSelect(goal.id, goal.title)}
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

export default CommandMenu;
