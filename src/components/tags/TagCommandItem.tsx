
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Tag } from '@/types/task';

interface TagCommandItemProps {
  tag: Tag;
  onSelect: (tagId: string) => void;
}

const TagCommandItem: React.FC<TagCommandItemProps> = ({ tag, onSelect }) => {
  return (
    <CommandItem
      key={tag.id}
      value={tag.name}
      onSelect={() => onSelect(tag.id)}
      className="flex items-center gap-2"
    >
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: tag.color }} 
      />
      {tag.name}
    </CommandItem>
  );
};

export default TagCommandItem;
