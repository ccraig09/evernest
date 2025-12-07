import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Today from './pages/Today';
import History from './pages/History';
import Settings from './pages/Settings';

// Route Guard to redirect to Onboarding if profile isn't set
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { profile } = useApp();
  if (!profile.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// Root Redirector
const RootRedirect = () => {
  const { profile } = useApp();
  return <Navigate to={profile.hasCompletedOnboarding ? "/today" : "/onboarding"} replace />;
};

const AppContent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route element={<Layout />}>
          <Route path="/today" element={
            <ProtectedRoute>
              <Today />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </HashRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;