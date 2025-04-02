
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
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

// Wrapper component to provide props to GoalDetailView
const GoalDetailViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return <GoalDetailView goalId={id || ''} onBack={() => navigate('/goals')} />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<GoalDetailViewWrapper />} />
        <Route path="/milestones" element={<MilestonePage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/mindmap" element={<MindMapPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/actions" element={<ActionsPage />} />
        <Route path="/weekly" element={<WeeklyPlanPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
