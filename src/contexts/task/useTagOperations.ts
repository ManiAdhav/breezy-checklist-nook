
import { useState, useCallback } from 'react';
import { Tag } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { fetchData, saveData } from '@/utils/dataSync';
import { toast } from '@/hooks/use-toast';

export const useTagOperations = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  
  const loadTags = useCallback(async () => {
    try {
      // Use our sync utility for consistent loading
      const tagsData = await fetchData<Tag>('tags', 'tags');
      console.log(`Loaded ${tagsData.length} tags from storage`);
      setTags(tagsData);
      return tagsData;
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      });
      return [];
    }
  }, []);
  
  const addTag = (name: string, color: string): Tag => {
    try {
      const newTag: Tag = {
        id: uuidv4(),
        name,
        color
      };
      
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      
      // Save tags to storage (as a side effect)
      saveData('tags', 'tags', updatedTags).catch(error => {
        console.error('Error saving tags:', error);
        toast({
          title: "Error",
          description: "Failed to save tag to storage",
          variant: "destructive",
        });
      });
      
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
      
      // Return a default tag in case of error
      return {
        id: uuidv4(),
        name,
        color
      };
    }
  };
  
  const updateTag = async (id: string, updates: Partial<Tag>): Promise<Tag | undefined> => {
    try {
      const updatedTags = tags.map(tag => 
        tag.id === id ? { ...tag, ...updates } : tag
      );
      
      setTags(updatedTags);
      
      // Save tags to storage
      await saveData('tags', 'tags', updatedTags);
      
      return updatedTags.find(tag => tag.id === id);
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      });
    }
  };
  
  const deleteTag = async (id: string): Promise<boolean> => {
    try {
      const updatedTags = tags.filter(tag => tag.id !== id);
      setTags(updatedTags);
      
      // Save tags to storage
      await saveData('tags', 'tags', updatedTags);
      
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    tags,
    setTags,
    loadTags,
    addTag,
    updateTag,
    deleteTag
  };
};
