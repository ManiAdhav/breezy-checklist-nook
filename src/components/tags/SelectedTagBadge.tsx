
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/types/task';

interface SelectedTagBadgeProps {
  tag: Tag;
  onRemove: (tagId: string) => void;
}

const SelectedTagBadge: React.FC<SelectedTagBadgeProps> = ({ tag, onRemove }) => {
  return (
    <Badge 
      key={tag.id} 
      style={{ backgroundColor: tag.color, color: '#fff' }}
      className="flex items-center gap-1 px-2 py-1 animate-fade-in"
    >
      {tag.name}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tag.id);
        }}
        className="rounded-full hover:bg-white/20 p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};

export default SelectedTagBadge;
