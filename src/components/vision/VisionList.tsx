
import React, { useState } from 'react';
import { useVision } from '@/contexts/VisionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Pencil, Trash2, CalendarIcon, Lightbulb } from 'lucide-react';
import VisionDetailView from './VisionDetailView';

const VisionList: React.FC = () => {
  const { visions, addVision, updateVision, deleteVision, areasOfLife, selectedVisionId, setSelectedVisionId } = useVision();
  
  const [isAddVisionOpen, setIsAddVisionOpen] = useState(false);
  const [isEditVisionOpen, setIsEditVisionOpen] = useState(false);
  const [visionTitle, setVisionTitle] = useState('');
  const [visionDescription, setVisionDescription] = useState('');
  const [visionArea, setVisionArea] = useState('');
  const [visionTargetDate, setVisionTargetDate] = useState<Date>(new Date());
  const [newAreaOfLife, setNewAreaOfLife] = useState('');
  const [isAddingNewArea, setIsAddingNewArea] = useState(false);
  const [editingVision, setEditingVision] = useState<string | null>(null);
  
  const resetForm = () => {
    setVisionTitle('');
    setVisionDescription('');
    setVisionArea('');
    setVisionTargetDate(new Date());
    setNewAreaOfLife('');
    setIsAddingNewArea(false);
  };

  const handleOpenAddVision = () => {
    resetForm();
    setIsAddVisionOpen(true);
  };

  const handleOpenEditVision = (vision: any) => {
    setEditingVision(vision.id);
    setVisionTitle(vision.title);
    setVisionDescription(vision.description || '');
    setVisionArea(vision.areaOfLife);
    setVisionTargetDate(new Date(vision.targetDate));
    setIsEditVisionOpen(true);
  };

  const handleAddVision = () => {
    if (visionTitle.trim()) {
      const areaToUse = isAddingNewArea && newAreaOfLife.trim() 
        ? newAreaOfLife.trim() 
        : visionArea;
      
      if (!areaToUse) return; // Ensure we have an area
      
      addVision({
        title: visionTitle.trim(),
        description: visionDescription.trim(),
        areaOfLife: areaToUse,
        targetDate: visionTargetDate,
        status: 'not_started',
      });
      
      resetForm();
      setIsAddVisionOpen(false);
    }
  };

  const handleUpdateVision = () => {
    if (visionTitle.trim() && editingVision) {
      const areaToUse = isAddingNewArea && newAreaOfLife.trim() 
        ? newAreaOfLife.trim() 
        : visionArea;
      
      if (!areaToUse) return; // Ensure we have an area
      
      updateVision(editingVision, {
        title: visionTitle.trim(),
        description: visionDescription.trim(),
        areaOfLife: areaToUse,
        targetDate: visionTargetDate,
      });
      
      resetForm();
      setIsEditVisionOpen(false);
      setEditingVision(null);
    }
  };

  const handleDeleteVision = (id: string) => {
    deleteVision(id);
    if (selectedVisionId === id) {
      setSelectedVisionId(null);
    }
  };

  const handleVisionClick = (id: string) => {
    setSelectedVisionId(id === selectedVisionId ? null : id);
  };

  // If a vision is selected, show its details
  if (selectedVisionId) {
    const vision = visions.find(v => v.id === selectedVisionId);
    if (vision) {
      return <VisionDetailView 
        vision={vision} 
        onBack={() => setSelectedVisionId(null)}
        onEdit={() => handleOpenEditVision(vision)}
        onDelete={() => handleDeleteVision(vision.id)}
      />;
    }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visions</h1>
        <Button variant="action" onClick={handleOpenAddVision}>
          Create a Vision
        </Button>
      </div>

      {visions.length === 0 ? (
        <div className="text-center py-10">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No visions yet</h3>
          <p className="text-muted-foreground mb-6">Create your first vision to set long-term aspirations</p>
          <Button variant="action" onClick={handleOpenAddVision}>
            Create a Vision
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visions.map((vision) => (
            <div 
              key={vision.id} 
              className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleVisionClick(vision.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{vision.title}</h3>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditVision(vision);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVision(vision.id);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-2 truncate">
                {vision.description || "No description"}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="bg-secondary px-2 py-1 rounded-full">
                  {vision.areaOfLife}
                </span>
                <span className="text-muted-foreground">
                  By {format(new Date(vision.targetDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vision Dialog */}
      <Dialog open={isAddVisionOpen} onOpenChange={setIsAddVisionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a Vision</DialogTitle>
            <DialogDescription>
              Define a long-term vision for your future. What do you aspire to achieve?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vision-title">Title</Label>
              <Input 
                id="vision-title" 
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="My Vision"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vision-description">Description (Optional)</Label>
              <Textarea 
                id="vision-description"
                value={visionDescription}
                onChange={(e) => setVisionDescription(e.target.value)}
                placeholder="Describe your vision in detail..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vision-area">Area of Life</Label>
              {isAddingNewArea ? (
                <div className="flex gap-2">
                  <Input 
                    id="new-area"
                    value={newAreaOfLife}
                    onChange={(e) => setNewAreaOfLife(e.target.value)}
                    placeholder="New area of life..."
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setIsAddingNewArea(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={visionArea} onValueChange={setVisionArea}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an area of life" />
                    </SelectTrigger>
                    <SelectContent>
                      {areasOfLife.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setIsAddingNewArea(true)}>
                    Add New
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vision-target-date">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="vision-target-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {visionTargetDate ? format(visionTargetDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={visionTargetDate}
                    onSelect={(date) => date && setVisionTargetDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVisionOpen(false)}>Cancel</Button>
            <Button variant="action" onClick={handleAddVision}>Create Vision</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vision Dialog */}
      <Dialog open={isEditVisionOpen} onOpenChange={setIsEditVisionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vision</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-vision-title">Title</Label>
              <Input 
                id="edit-vision-title" 
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-vision-description">Description (Optional)</Label>
              <Textarea 
                id="edit-vision-description"
                value={visionDescription}
                onChange={(e) => setVisionDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-vision-area">Area of Life</Label>
              {isAddingNewArea ? (
                <div className="flex gap-2">
                  <Input 
                    id="edit-new-area"
                    value={newAreaOfLife}
                    onChange={(e) => setNewAreaOfLife(e.target.value)}
                    placeholder="New area of life..."
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setIsAddingNewArea(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={visionArea} onValueChange={setVisionArea}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an area of life" />
                    </SelectTrigger>
                    <SelectContent>
                      {areasOfLife.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setIsAddingNewArea(true)}>
                    Add New
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-vision-target-date">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="edit-vision-target-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {visionTargetDate ? format(visionTargetDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={visionTargetDate}
                    onSelect={(date) => date && setVisionTargetDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditVisionOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateVision}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisionList;
