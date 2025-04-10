
import { Tag } from '@/types/task';

// Filter tags based on search value and exclude already selected ones
export const filterTags = (tags: Tag[], searchValue: string, selectedTagIds: string[]): Tag[] => {
  return tags.filter(tag => 
    tag.name.toLowerCase().includes(searchValue.toLowerCase()) && 
    !selectedTagIds.includes(tag.id)
  );
};

// Get recently used tags (excluding selected ones)
export const getRecentTags = (tags: Tag[], selectedTagIds: string[], limit: number = 5): Tag[] => {
  return tags
    .filter(tag => !selectedTagIds.includes(tag.id))
    .slice(0, limit);
};
