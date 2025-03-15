
import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MindMapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const MindMapControls: React.FC<MindMapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-background/90 shadow-md rounded-lg p-2 space-y-2 backdrop-blur-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomIn} 
        aria-label="Zoom In"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomOut} 
        aria-label="Zoom Out"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onResetView} 
        aria-label="Reset View"
      >
        <Maximize className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MindMapControls;
