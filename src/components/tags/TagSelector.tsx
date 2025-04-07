
import React, { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Tag } from '@/types/task';
import TagBadge from './TagBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { generateRandomColor } from '@/contexts/task/useTagOperations';

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagIds, onTagsChange }) => {
  const { tags, addTag } = useTask();
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      const newTag = addTag({
        name: newTagName.trim(),
        color: generateRandomColor()
      });
      
      // Since addTag now properly returns a Tag object with id, this is safe
      onTagsChange([...selectedTagIds, newTag.id]);
      setNewTagName('');
      setIsCreatingTag(false);
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTagIds.filter(id => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[36px] bg-background border border-input rounded-md p-1">
        {selectedTagIds.map(tagId => (
          <TagBadge 
            key={tagId} 
            tagId={tagId} 
            onRemove={() => handleRemoveTag(tagId)} 
          />
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs rounded-full"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-2">
              {isCreatingTag ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8" 
                      onClick={() => setIsCreatingTag(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleAddNewTag} 
                    className="w-full h-8 text-xs"
                    disabled={!newTagName.trim()}
                  >
                    Create Tag
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {tags.length > 0 ? (
                      tags.map(tag => (
                        <div 
                          key={tag.id} 
                          className={`
                            flex items-center p-1.5 rounded-md cursor-pointer text-sm
                            ${selectedTagIds.includes(tag.id) ? 'bg-accent' : 'hover:bg-accent/50'}
                          `}
                          onClick={() => handleToggleTag(tag.id)}
                        >
                          <div 
                            className="h-3 w-3 rounded-full mr-2" 
                            style={{ backgroundColor: tag.color }} 
                          />
                          <span>{tag.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-1">
                        No tags created yet
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 text-xs h-8"
                    onClick={() => setIsCreatingTag(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create New Tag
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagSelector;
