
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Index from './pages/Index';
import GoalsPage from './pages/GoalsPage';
import GoalDetailView from './components/goals/GoalDetailView';
import VisionPage from './pages/VisionPage';
import MindMapPage from './pages/MindMapPage';
import CalendarPage from './pages/CalendarPage';
import ActionsPage from './pages/ActionsPage';
import WeeklyPage from './pages/WeeklyPage';
import NotFound from './pages/NotFound';
import HabitsPage from './pages/HabitsPage';
import { TaskProvider } from './contexts/TaskContext';
import { HabitProvider } from './contexts/HabitContext';
import { GoalProvider } from './contexts/GoalContext';
import { VisionProvider } from '@/contexts/VisionContext';
import { Toaster } from "@/components/ui/toaster";

// Wrapper component to provide props to GoalDetailView
const GoalDetailViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return <GoalDetailView goalId={id || ''} onBack={() => navigate('/goals')} />;
};

function App() {
  return (
    <TaskProvider>
      <GoalProvider>
        <VisionProvider>
          <HabitProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/goals/:id" element={<GoalDetailViewWrapper />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/mindmap" element={<MindMapPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/actions" element={<ActionsPage />} />
              <Route path="/weekly" element={<WeeklyPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </HabitProvider>
        </VisionProvider>
      </GoalProvider>
    </TaskProvider>
  );
}

export default App;
