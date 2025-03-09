
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThreeYearGoal, NinetyDayTarget, WeeklyGoal, GoalStatus } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { toast } from '@/hooks/use-toast';

// Sample goals for demonstration
const sampleThreeYearGoals: ThreeYearGoal[] = [
  {
    id: generateId(),
    title: 'Master Web Development',
    description: 'Become proficient in full-stack web development with React, Node.js, and related technologies.',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years from now
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface GoalContextType {
  threeYearGoals: ThreeYearGoal[];
  ninetyDayTargets: NinetyDayTarget[];
  weeklyGoals: WeeklyGoal[];
  addThreeYearGoal: (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateThreeYearGoal: (id: string, updates: Partial<ThreeYearGoal>) => void;
  deleteThreeYearGoal: (id: string) => void;
  addNinetyDayTarget: (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNinetyDayTarget: (id: string, updates: Partial<NinetyDayTarget>) => void;
  deleteNinetyDayTarget: (id: string) => void;
  addWeeklyGoal: (goal: Omit<WeeklyGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWeeklyGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
  deleteWeeklyGoal: (id: string) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeYearGoals, setThreeYearGoals] = useState<ThreeYearGoal[]>(sampleThreeYearGoals);
  const [ninetyDayTargets, setNinetyDayTargets] = useState<NinetyDayTarget[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedThreeYearGoals = localStorage.getItem('threeYearGoals');
    const savedNinetyDayTargets = localStorage.getItem('ninetyDayTargets');
    const savedWeeklyGoals = localStorage.getItem('weeklyGoals');

    if (savedThreeYearGoals) setThreeYearGoals(JSON.parse(savedThreeYearGoals));
    if (savedNinetyDayTargets) setNinetyDayTargets(JSON.parse(savedNinetyDayTargets));
    if (savedWeeklyGoals) setWeeklyGoals(JSON.parse(savedWeeklyGoals));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('threeYearGoals', JSON.stringify(threeYearGoals));
    localStorage.setItem('ninetyDayTargets', JSON.stringify(ninetyDayTargets));
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
  }, [threeYearGoals, ninetyDayTargets, weeklyGoals]);

  // Three Year Goal operations
  const addThreeYearGoal = (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: ThreeYearGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setThreeYearGoals(prevGoals => [...prevGoals, newGoal]);
    toast({
      title: "Goal added",
      description: "Your three-year goal was added successfully.",
    });
  };

  const updateThreeYearGoal = (id: string, updates: Partial<ThreeYearGoal>) => {
    setThreeYearGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id 
          ? { ...goal, ...updates, updatedAt: new Date() } 
          : goal
      )
    );
    toast({
      title: "Goal updated",
      description: "Your three-year goal was updated successfully.",
    });
  };

  const deleteThreeYearGoal = (id: string) => {
    setThreeYearGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    
    // Delete all associated 90-day targets
    setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.threeYearGoalId !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your three-year goal was deleted successfully.",
      variant: "destructive",
    });
  };

  // 90-Day Target operations
  const addNinetyDayTarget = (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTarget: NinetyDayTarget = {
      ...target,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNinetyDayTargets(prevTargets => [...prevTargets, newTarget]);
    toast({
      title: "Target added",
      description: "Your 90-day target was added successfully.",
    });
  };

  const updateNinetyDayTarget = (id: string, updates: Partial<NinetyDayTarget>) => {
    setNinetyDayTargets(prevTargets => 
      prevTargets.map(target => 
        target.id === id 
          ? { ...target, ...updates, updatedAt: new Date() } 
          : target
      )
    );
    toast({
      title: "Target updated",
      description: "Your 90-day target was updated successfully.",
    });
  };

  const deleteNinetyDayTarget = (id: string) => {
    setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.id !== id));
    
    // Delete all associated weekly goals
    setWeeklyGoals(prevGoals => prevGoals.filter(goal => goal.ninetyDayTargetId !== id));
    
    toast({
      title: "Target deleted",
      description: "Your 90-day target was deleted successfully.",
      variant: "destructive",
    });
  };

  // Weekly Goal operations
  const addWeeklyGoal = (goal: Omit<WeeklyGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: WeeklyGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWeeklyGoals(prevGoals => [...prevGoals, newGoal]);
    toast({
      title: "Goal added",
      description: "Your weekly goal was added successfully.",
    });
  };

  const updateWeeklyGoal = (id: string, updates: Partial<WeeklyGoal>) => {
    setWeeklyGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id 
          ? { ...goal, ...updates, updatedAt: new Date() } 
          : goal
      )
    );
    toast({
      title: "Goal updated",
      description: "Your weekly goal was updated successfully.",
    });
  };

  const deleteWeeklyGoal = (id: string) => {
    setWeeklyGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your weekly goal was deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <GoalContext.Provider value={{
      threeYearGoals,
      ninetyDayTargets,
      weeklyGoals,
      addThreeYearGoal,
      updateThreeYearGoal,
      deleteThreeYearGoal,
      addNinetyDayTarget,
      updateNinetyDayTarget,
      deleteNinetyDayTarget,
      addWeeklyGoal,
      updateWeeklyGoal,
      deleteWeeklyGoal,
    }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};
