
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useTagSelection } from './hooks/useTagSelection';
import SelectedTagBadge from './SelectedTagBadge';
import TagCommandItem from './TagCommandItem';
import TagCreateOption from './TagCreateOption';

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
  const {
    open,
    setOpen,
    searchValue,
    setSearchValue,
    inputRef,
    containerRef,
    selectedTags,
    filteredTags,
    recentTags,
    handleCreateTag,
    handleKeyDown,
    removeTag,
    addTagToSelection
  } = useTagSelection(selectedTagIds, onTagsChange, enableAutoCreate);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <div 
          ref={containerRef}
          className="flex flex-wrap gap-1 p-1.5 border rounded-md min-h-[38px] transition-all duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedTags.map(tag => (
            <SelectedTagBadge 
              key={tag.id} 
              tag={tag} 
              onRemove={removeTag} 
            />
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
              <TagCreateOption 
                searchValue={searchValue}
                enableAutoCreate={enableAutoCreate}
                onCreate={handleCreateTag}
              />
              
              {recentTags.length > 0 && !searchValue && (
                <>
                  <CommandGroup heading="Recent Tags">
                    {recentTags.map(tag => (
                      <TagCommandItem 
                        key={tag.id}
                        tag={tag} 
                        onSelect={addTagToSelection} 
                      />
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              
              <CommandGroup heading="All Tags">
                {filteredTags.map(tag => (
                  <TagCommandItem 
                    key={tag.id}
                    tag={tag} 
                    onSelect={addTagToSelection} 
                  />
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
