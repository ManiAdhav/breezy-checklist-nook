
import React from 'react';
import TagSelector from '@/components/tags/TagSelector';

interface MinimalTagsFieldProps {
  selectedTagIds: string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}

export const MinimalTagsField: React.FC<MinimalTagsFieldProps> = ({ 
  selectedTagIds, 
  setSelectedTagIds 
}) => {
  return (
    <div>
      <TagSelector
        selectedTagIds={selectedTagIds}
        onTagsChange={setSelectedTagIds}
        enableAutoCreate={true}
      />
    </div>
  );
};
