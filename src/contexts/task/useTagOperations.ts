
import { useState } from 'react';
import { Tag } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { generateId } from '@/utils/taskUtils';

// Generate a random color
export const generateRandomColor = (): string => {
  const colors = [
    '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', 
    '#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', 
    '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F1F0FB', 
    '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9',
    '#33C3F0', '#0FA0CE', '#ea384c'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useTagOperations = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  const loadTags = () => {
    try {
      const storedTags = localStorage.getItem('tags');
      if (storedTags) {
        setTags(JSON.parse(storedTags));
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const saveTags = (updatedTags: Tag[]) => {
    try {
      localStorage.setItem('tags', JSON.stringify(updatedTags));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const addTag = (tag: Omit<Tag, 'id'>): Tag => {
    const newTag: Tag = {
      ...tag,
      id: generateId(),
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    saveTags(updatedTags);
    
    toast({
      title: "Tag added",
      description: "Your tag was added successfully.",
    });
    
    return newTag;
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    const updatedTags = tags.map(tag => 
      tag.id === id ? { ...tag, ...updates } : tag
    );
    
    setTags(updatedTags);
    saveTags(updatedTags);
    
    toast({
      title: "Tag updated",
      description: "Your tag was updated successfully.",
    });
  };

  const deleteTag = (id: string) => {
    const updatedTags = tags.filter(tag => tag.id !== id);
    setTags(updatedTags);
    saveTags(updatedTags);
    
    toast({
      title: "Tag deleted",
      description: "Your tag was deleted successfully.",
      variant: "destructive",
    });
  };

  return {
    tags,
    setTags,
    loadTags,
    addTag,
    updateTag,
    deleteTag,
  };
};
