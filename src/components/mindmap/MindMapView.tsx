
import React, { useRef, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { ThreeYearGoal } from '@/types/task';
import MindMapGoalForm from './MindMapGoalForm';
import MindMapHeader from './view/MindMapHeader';
import MindMapControls from './view/MindMapControls';
import MindMapCanvas from './view/MindMapCanvas';
import { useMindMapControls } from './view/useMindMapControls';

const MindMapView: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<ThreeYearGoal | null>(null);
  
  const { threeYearGoals, isLoading } = useGoal();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    zoomLevel,
    pan,
    isPanning,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useMindMapControls(containerRef);
  
  // Center the map when goals are loaded
  useEffect(() => {
    if (threeYearGoals.length > 0 && containerRef.current) {
      handleResetView();
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
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" ref={containerRef}>
      <MindMapHeader onAddGoal={handleAddGoal} />
      
      <div className="flex-1 overflow-hidden relative">
        {/* Zoom and Pan Controls */}
        <MindMapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />
        
        {/* Mind Map Canvas */}
        <MindMapCanvas
          threeYearGoals={threeYearGoals}
          pan={pan}
          zoomLevel={zoomLevel}
          isPanning={isPanning}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onEditGoal={handleEditGoal}
        />
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
