import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import Analyze from './pages/Analyze'
import Alerts from './pages/Alerts'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Bins from './pages/Bins'
import BinDetail from './pages/BinDetail'
import Devices from './pages/Devices'
import Facilities from './pages/Facilities'
import Analytics from './pages/Analytics'
import AiPerformance from './pages/AiPerformance'
import Reports from './pages/Reports'
import Rules from './pages/Rules'
import Audit from './pages/Audit'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/bins" element={<Bins />} />
        <Route path="/bins/:binId" element={<BinDetail />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-performance" element={<AiPerformance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
