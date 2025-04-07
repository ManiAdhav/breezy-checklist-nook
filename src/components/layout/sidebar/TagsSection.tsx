
import React, { useState } from 'react';
import { Edit2, Trash2, ChevronRight, ChevronDown, Plus, Tag as TagIcon } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateRandomColor } from '@/contexts/task/useTagOperations';

const TagsSection: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag } = useTask();
  const [expanded, setExpanded] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('');

  const handleCreateTag = () => {
    setEditingTag(null);
    setTagName('');
    setTagColor(generateRandomColor());
    setIsDialogOpen(true);
  };

  const handleEditTag = (id: string, name: string, color: string) => {
    setEditingTag({ id, name, color });
    setTagName(name);
    setTagColor(color);
    setIsDialogOpen(true);
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) return;

    if (editingTag) {
      updateTag(editingTag.id, { 
        name: tagName.trim(), 
        color: tagColor 
      });
    } else {
      addTag({ 
        name: tagName.trim(), 
        color: tagColor 
      });
    }

    setIsDialogOpen(false);
    setTagName('');
    setTagColor('');
    setEditingTag(null);
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteTag(id);
    }
  };

  return (
    <>
      <div className="mb-4">
        <div 
          className="flex items-center justify-between py-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            {expanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
            Tags
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => {
              e.stopPropagation();
              handleCreateTag();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {expanded && (
          <div className="pl-6 pr-2 mt-1 space-y-1">
            {tags.length > 0 ? (
              tags.map(tag => (
                <div 
                  key={tag.id}
                  className="flex items-center justify-between py-1.5 px-2 text-sm rounded-md hover:bg-accent/50 group"
                >
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{ backgroundColor: tag.color }} 
                    />
                    <span>{tag.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleEditTag(tag.id, tag.name, tag.color)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground py-2">
                No tags created yet
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag-color">Tag Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-8 w-8 rounded-full border" 
                  style={{ backgroundColor: tagColor }}
                />
                <Input
                  id="tag-color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-12 h-8 p-0"
                />
                <span className="text-sm">{tagColor}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag} disabled={!tagName.trim()}>
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TagsSection;
