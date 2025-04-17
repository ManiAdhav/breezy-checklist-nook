
import { useState, useRef, useEffect } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { generateRandomColor } from '@/utils/colorUtils'; // Updated import
import { filterTags, getRecentTags } from '../utils/tagUtils';

export const useTagSelection = (
  selectedTagIds: string[],
  onTagsChange: (tagIds: string[]) => void,
  enableAutoCreate: boolean
) => {
  const { tags, addTag } = useTask();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const filteredTags = filterTags(tags, searchValue, selectedTagIds);
  const recentTags = getRecentTags(tags, selectedTagIds, 5);

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

  return {
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
  };
};
