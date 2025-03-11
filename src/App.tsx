
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import GoalsPage from './pages/GoalsPage';
import NinetyDayTargetsPage from './pages/NinetyDayTargetsPage';
import WeeklyGoalsPage from './pages/WeeklyGoalsPage';
import CalendarPage from './pages/CalendarPage';
import VisionPage from './pages/VisionPage';
import MindMapPage from './pages/MindMapPage';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/targets" element={<NinetyDayTargetsPage />} />
        <Route path="/weekly" element={<WeeklyGoalsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mindmap" element={<MindMapPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
