
import { useState, useRef, useEffect } from 'react';

interface MindMapControls {
  zoomLevel: number;
  pan: { x: number; y: number };
  isPanning: boolean;
  startPoint: { x: number; y: number };
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export const useMindMapControls = (containerRef: React.RefObject<HTMLDivElement>): MindMapControls => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  // Center the map when the container is available
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setPan({
        x: container.clientWidth / 2 - 150,
        y: container.clientHeight / 2 - 150
      });
    }
  }, [containerRef.current]);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleResetView = () => {
    setZoomLevel(1);
    if (containerRef.current) {
      const container = containerRef.current;
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
  
  return {
    zoomLevel,
    pan,
    isPanning,
    startPoint,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
