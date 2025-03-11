
import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize, 
  Check,
  X
} from 'lucide-react';
import { Motion, spring } from 'react-motion';
import { Button } from '@/components/ui/button';
import { useGoal } from '@/contexts/GoalContext';
import { useVision } from '@/contexts/VisionContext';
import { ThreeYearGoal } from '@/types/task';
import MindMapNode from './MindMapNode';
import MindMapGoalForm from './MindMapGoalForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const MindMapView: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ThreeYearGoal | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  const { threeYearGoals, isLoading } = useGoal();
  const { visions } = useVision();
  const isMobile = useIsMobile().isMobile;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Center the map when goals are loaded
  useEffect(() => {
    if (threeYearGoals.length > 0 && mapContainerRef.current) {
      const container = mapContainerRef.current;
      setPan({
        x: container.clientWidth / 2 - 150,
        y: container.clientHeight / 2 - 150
      });
    }
  }, [threeYearGoals]);
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };
  
  const handleEditGoal = (goal: ThreeYearGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleResetView = () => {
    setZoomLevel(1);
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      setPan({
        x: container.clientWidth / 2 - 150,
        y: container.clientHeight / 2 - 100
      });
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      setStartPoint({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPoint.x,
        y: e.clientY - startPoint.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setStartPoint({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - startPoint.x,
        y: e.touches[0].clientY - startPoint.y
      });
      e.preventDefault(); // Prevent default browser behavior
    }
  };
  
  const handleTouchEnd = () => {
    setIsPanning(false);
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-2xl font-semibold">Mind Map</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize your goals and their connections
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAddGoal}
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Add Goal</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {/* Zoom and Pan Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-background/90 shadow-md rounded-lg p-2 space-y-2 backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn} 
            aria-label="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut} 
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleResetView} 
            aria-label="Reset View"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mind Map */}
        <div 
          ref={mapContainerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Motion 
            defaultStyle={{ x: 0, y: 0, scale: 0.8 }}
            style={{ 
              x: spring(pan.x), 
              y: spring(pan.y),
              scale: spring(zoomLevel)
            }}
          >
            {interpolatedStyle => (
              <div 
                className="absolute origin-center transition-transform will-change-transform"
                style={{ 
                  transform: `translate(${interpolatedStyle.x}px, ${interpolatedStyle.y}px) scale(${interpolatedStyle.scale})`,
                }}
              >
                {/* Center Node */}
                <div className="absolute w-40 h-40 rounded-full bg-primary/20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                  <div className="text-lg font-semibold text-center">Your Goals</div>
                </div>
                
                {/* Goal Nodes */}
                {threeYearGoals.map((goal, index) => {
                  // Position goals in a circle around the center
                  const angle = (2 * Math.PI * index) / threeYearGoals.length;
                  const radius = 300;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <MindMapNode 
                      key={goal.id}
                      goal={goal}
                      position={{ x, y }}
                      onEdit={() => handleEditGoal(goal)}
                    />
                  );
                })}
              </div>
            )}
          </Motion>
        </div>
      </div>
      
      {/* Goal Form Modal */}
      <MindMapGoalForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm}
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default MindMapView;
