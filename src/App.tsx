
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import { GoalProvider } from './contexts/GoalContext';
import Index from './pages/Index';
import GoalsPage from './pages/GoalsPage';
import GoalDetailView from './components/goals/GoalDetailView';
import MilestonePage from './pages/MilestonePage';
import VisionPage from './pages/VisionPage';
import PlansPage from './pages/PlansPage';
import MindMapPage from './pages/MindMapPage';
import CalendarPage from './pages/CalendarPage';
import ActionsPage from './pages/ActionsPage';
import NotFound from './pages/NotFound';
import WeeklyPlanPage from './pages/WeeklyPlanPage';

function App() {
  return (
    <GoalProvider>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/:id" element={<GoalDetailView />} />
          <Route path="/milestones" element={<MilestonePage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/mindmap" element={<MindMapPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/weekly" element={<WeeklyPlanPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TaskProvider>
    </GoalProvider>
  );
}

export default App;
