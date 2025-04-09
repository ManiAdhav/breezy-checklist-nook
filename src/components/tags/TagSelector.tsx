
import React, { useState, useRef, useEffect } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { generateRandomColor } from '@/contexts/task/useTagOperations';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput,
  CommandItem, 
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  enableAutoCreate?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  selectedTagIds, 
  onTagsChange,
  enableAutoCreate = false
}) => {
  const { tags, addTag } = useTask();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));

  // Filter tags based on search value
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchValue.toLowerCase()) && 
    !selectedTagIds.includes(tag.id)
  );

  // Get recently used tags (excluding selected ones)
  const recentTags = tags
    .filter(tag => !selectedTagIds.includes(tag.id))
    .slice(0, 5);

  // Handle tag creation for autocomplete
  const handleCreateTag = () => {
    if (searchValue.trim() && enableAutoCreate) {
      const newTag = addTag({
        name: searchValue.trim(),
        color: generateRandomColor()
      });
      
      onTagsChange([...selectedTagIds, newTag.id]);
      setSearchValue('');
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim() && enableAutoCreate) {
      e.preventDefault();
      handleCreateTag();
    } else if (e.key === 'Backspace' && !searchValue && selectedTagIds.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      onTagsChange(selectedTagIds.slice(0, -1));
    }
  };

  // Remove a tag
  const removeTag = (tagId: string) => {
    onTagsChange(selectedTagIds.filter(id => id !== tagId));
  };

  // Add a tag
  const addTagToSelection = (tagId: string) => {
    onTagsChange([...selectedTagIds, tagId]);
    setSearchValue('');
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Adjust input container height based on content
  useEffect(() => {
    if (containerRef.current) {
      const hasMultipleRows = selectedTags.length > 2;
      containerRef.current.style.minHeight = hasMultipleRows ? '60px' : '38px';
    }
  }, [selectedTags.length]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <div 
          ref={containerRef}
          className="flex flex-wrap gap-1 p-1.5 border rounded-md min-h-[38px] transition-all duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedTags.map(tag => (
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
                  removeTag(tag.id);
                }}
                className="rounded-full hover:bg-white/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <PopoverTrigger asChild>
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
              className="border-none !outline-none !ring-0 flex-1 min-w-[120px] h-6 p-0 placeholder:text-gray-400"
            />
          </PopoverTrigger>
        </div>
        
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {enableAutoCreate && searchValue.trim() ? (
                  <button
                    className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 text-left transition-colors"
                    onClick={handleCreateTag}
                  >
                    <Plus className="h-4 w-4" />
                    Create "{searchValue}"
                  </button>
                ) : (
                  "No tags found"
                )}
              </CommandEmpty>
              
              {recentTags.length > 0 && !searchValue && (
                <>
                  <CommandGroup heading="Recent Tags">
                    {recentTags.map(tag => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => addTagToSelection(tag.id)}
                        className="flex items-center gap-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color }} 
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              
              <CommandGroup heading="All Tags">
                {filteredTags.map(tag => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => addTagToSelection(tag.id)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }} 
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelector;
