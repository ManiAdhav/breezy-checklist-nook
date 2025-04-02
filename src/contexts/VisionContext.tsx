
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vision, GoalStatus, Goals } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

interface VisionContextType {
  visions: Vision[];
  addVision: (vision: Omit<Vision, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVision: (id: string, vision: Partial<Vision>) => void;
  deleteVision: (id: string) => void;
  selectedVisionId: string | null;
  setSelectedVisionId: (id: string | null) => void;
  areasOfLife: string[];
  getVisionGoals: (visionId: string, goals: Goals[]) => Goals[];
}

const VisionContext = createContext<VisionContextType | undefined>(undefined);

export const useVision = () => {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error('useVision must be used within a VisionProvider');
  }
  return context;
};

// Pre-defined areas of life
const defaultAreasOfLife = [
  'Career',
  'Finance',
  'Health',
  'Family',
  'Relationships',
  'Personal Development',
  'Spirituality',
  'Community',
];

export const VisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visions, setVisions] = useState<Vision[]>(() => {
    const saved = localStorage.getItem('visions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((vision: any) => ({
          ...vision,
          targetDate: new Date(vision.targetDate),
          createdAt: new Date(vision.createdAt),
          updatedAt: new Date(vision.updatedAt),
        }));
      } catch (e) {
        console.error('Failed to parse visions from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [areasOfLife, setAreasOfLife] = useState<string[]>(() => {
    const saved = localStorage.getItem('areasOfLife');
    return saved ? JSON.parse(saved) : defaultAreasOfLife;
  });

  const [selectedVisionId, setSelectedVisionId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('visions', JSON.stringify(visions));
  }, [visions]);

  useEffect(() => {
    localStorage.setItem('areasOfLife', JSON.stringify(areasOfLife));
  }, [areasOfLife]);

  const addVision = (vision: Omit<Vision, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newVision: Vision = {
      ...vision,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setVisions((prev) => [...prev, newVision]);
    
    // Add new area of life if it doesn't exist
    if (!areasOfLife.includes(vision.areaOfLife)) {
      setAreasOfLife((prev) => [...prev, vision.areaOfLife]);
    }
  };

  const updateVision = (id: string, updates: Partial<Vision>) => {
    setVisions((prev) => 
      prev.map((vision) =>
        vision.id === id
          ? { ...vision, ...updates, updatedAt: new Date() }
          : vision
      )
    );
    
    // Add new area of life if it doesn't exist
    if (updates.areaOfLife && !areasOfLife.includes(updates.areaOfLife)) {
      setAreasOfLife((prev) => [...prev, updates.areaOfLife]);
    }
  };

  const deleteVision = (id: string) => {
    setVisions((prev) => prev.filter((vision) => vision.id !== id));
  };
  
  // Modified to accept goals as a parameter instead of using useGoal
  const getVisionGoals = (visionId: string, goals: Goals[]): Goals[] => {
    return goals.filter(goal => goal.visionId === visionId);
  };

  return (
    <VisionContext.Provider value={{
      visions,
      addVision,
      updateVision,
      deleteVision,
      selectedVisionId,
      setSelectedVisionId,
      areasOfLife,
      getVisionGoals
    }}>
      {children}
    </VisionContext.Provider>
  );
};
