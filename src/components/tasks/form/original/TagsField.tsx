
import React from 'react';
import { Label } from "@/components/ui/label";
import TagSelector from '@/components/tags/TagSelector';

interface TagsFieldProps {
  selectedTagIds: string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}

export const TagsField: React.FC<TagsFieldProps> = ({ 
  selectedTagIds, 
  setSelectedTagIds 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <TagSelector
        selectedTagIds={selectedTagIds}
        onTagsChange={setSelectedTagIds}
      />
    </div>
  );
};
