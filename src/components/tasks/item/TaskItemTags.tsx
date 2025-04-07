
import React from 'react';
import TagBadge from '@/components/tags/TagBadge';

interface TaskItemTagsProps {
  tags?: string[];
}

const TaskItemTags: React.FC<TaskItemTagsProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map(tagId => (
        <TagBadge key={tagId} tagId={tagId} />
      ))}
    </div>
  );
};

export default TaskItemTags;
