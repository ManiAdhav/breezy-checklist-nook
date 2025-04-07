
import React from 'react';
import { Tag } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tagId: string;
  className?: string;
  onRemove?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tagId, className, onRemove }) => {
  const { tags } = useTask();
  const tag = tags.find(t => t.id === tagId);

  if (!tag) return null;

  return (
    <span 
      className={cn(
        "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full mr-1",
        className
      )}
      style={{ 
        backgroundColor: `${tag.color}20`, // 20 is hex for 12% opacity
        color: tag.color
      }}
    >
      {tag.name}
      {onRemove && (
        <span 
          className="ml-1 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          &times;
        </span>
      )}
    </span>
  );
};

export default TagBadge;
