
import React, { useRef } from 'react';
import { Motion, spring } from 'react-motion';
import { ThreeYearGoal } from '@/types/task';
import MindMapNode from '../MindMapNode';

interface MindMapCanvasProps {
  threeYearGoals: ThreeYearGoal[];
  pan: { x: number; y: number };
  zoomLevel: number;
  isPanning: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onEditGoal: (goal: ThreeYearGoal) => void;
}

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  threeYearGoals,
  pan,
  zoomLevel,
  isPanning,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onEditGoal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={mapContainerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
                  onEdit={() => onEditGoal(goal)}
                />
              );
            })}
          </div>
        )}
      </Motion>
    </div>
  );
};

export default MindMapCanvas;
