
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DynamicIcon from '@/components/ui/dynamic-icon';

export const listIconOptions = [
  { value: 'List', label: 'List' },
  { value: 'ListChecks', label: 'List Checks' },
  { value: 'ListTodo', label: 'Todo List' },
  { value: 'Package', label: 'Package' },
  { value: 'Folder', label: 'Folder' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Book', label: 'Book' },
  { value: 'Bookmark', label: 'Bookmark' },
  { value: 'Star', label: 'Star' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Lightbulb', label: 'Idea' },
  { value: 'GraduationCap', label: 'Education' },
  { value: 'Home', label: 'Home' },
  { value: 'Laptop', label: 'Work' },
  { value: 'ShoppingCart', label: 'Shopping' }
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconValue: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-md flex-shrink-0"
          title="Click to change icon"
        >
          <DynamicIcon name={selectedIcon} className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <div className="grid grid-cols-5 gap-2">
          {listIconOptions.map((iconOption) => (
            <Button
              key={iconOption.value}
              variant={selectedIcon === iconOption.value ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => onSelectIcon(iconOption.value)}
              type="button"
              title={iconOption.label}
            >
              <DynamicIcon name={iconOption.value} className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
