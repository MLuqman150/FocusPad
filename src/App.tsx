import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useWorkspaceStore } from './store/workspaceStore';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ChatPage from './pages/ChatPage';
import NotesPage from './pages/NotesPage';
import TimePage from './pages/TimePage';
import ClientsPage from './pages/ClientsPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { workspaces, setCurrentWorkspace } = useWorkspaceStore();

  // Auto-select first workspace if none selected
  React.useEffect(() => {
    if (isAuthenticated && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [isAuthenticated, workspaces, setCurrentWorkspace]);

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/time" element={<TimePage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/settings" element={<div className="p-6"><h1>Settings</h1></div>} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;