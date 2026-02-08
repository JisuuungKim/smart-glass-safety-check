import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

// Pages
import VoiceRecorderPage from '@pages/user/VoiceRecorderPage';
import SelectFactoryPage from '@pages/user/SelectFactoryPage';
import SmartGlassConnectPage from '@pages/user/SmartGlassConnectPage';
import EquipmentScanPage from '@pages/user/EquipmentScanPage';
import AdminDashboard from '@pages/admin/DashboardPage';
import InspectionCompletePage from '@pages/user/InspectionCompletePage';

// Import CSS
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<SelectFactoryPage />} />
          <Route path="voice-recorder" element={<VoiceRecorderPage />} />
          <Route path="smart-glass-connect" element={<SmartGlassConnectPage />} />
          <Route path="equipment-scan" element={<EquipmentScanPage />} />
          <Route path="voice-recorder/complete" element={<InspectionCompletePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        
        {/* Catch all other routes and redirect to user */}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </Router>
  );
}

export default App;