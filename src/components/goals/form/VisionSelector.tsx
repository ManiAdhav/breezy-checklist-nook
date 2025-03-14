
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { useVision } from '@/contexts/VisionContext';
import { Vision } from '@/types/task';

interface VisionSelectorProps {
  visionId: string;
  onVisionChange: (value: string) => void;
}

const VisionSelector: React.FC<VisionSelectorProps> = ({ visionId, onVisionChange }) => {
  const { visions } = useVision();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="vision-select">Map to Vision (optional)</Label>
      <Select value={visionId} onValueChange={onVisionChange}>
        <SelectTrigger id="vision-select">
          <SelectValue placeholder="Select a vision to map" />
        </SelectTrigger>
        <SelectContent>
          {visions.map((vision: Vision) => (
            <SelectItem key={vision.id} value={vision.id}>
              {vision.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VisionSelector;
