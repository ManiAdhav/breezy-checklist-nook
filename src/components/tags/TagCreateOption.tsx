
import React from 'react';
import { Plus } from 'lucide-react';
import { CommandEmpty } from '@/components/ui/command';

interface TagCreateOptionProps {
  searchValue: string;
  enableAutoCreate: boolean;
  onCreate: () => void;
}

const TagCreateOption: React.FC<TagCreateOptionProps> = ({ 
  searchValue, 
  enableAutoCreate, 
  onCreate 
}) => {
  if (!enableAutoCreate || !searchValue.trim()) {
    return <CommandEmpty>No tags found</CommandEmpty>;
  }

  return (
    <CommandEmpty>
      <button
        className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 text-left transition-colors"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4" />
        Create "{searchValue}"
      </button>
    </CommandEmpty>
  );
};

export default TagCreateOption;
