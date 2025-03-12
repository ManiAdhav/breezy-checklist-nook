
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import GoalsPage from './pages/GoalsPage';
import NinetyDayTargetsPage from './pages/NinetyDayTargetsPage';
import PlansPage from './pages/PlansPage';
import CalendarPage from './pages/CalendarPage';
import VisionPage from './pages/VisionPage';
import MindMapPage from './pages/MindMapPage';
import ActionsPage from './pages/ActionsPage';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { GoalProvider } from '@/contexts/GoalContext';
import { TaskProvider } from '@/contexts/TaskContext';

function App() {
  return (
    <Router>
      <GoalProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vision" element={<VisionPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/targets" element={<NinetyDayTargetsPage />} />
            <Route path="/weekly" element={<PlansPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/mindmap" element={<MindMapPage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TaskProvider>
      </GoalProvider>
    </Router>
  );
}

export default App;
