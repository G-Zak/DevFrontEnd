// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import Login from './features/auth/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import useProjects from './hooks/useProjects';
import { logout } from './features/auth/authSlice';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function App() {
  const user = useSelector((s: RootState) => s.auth.user);

  if (!user) return <Login />;

  return <Dashboard />;
}

function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggle = useCallback(() => setSidebarOpen(p => !p), []);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title="TaskFlow"
        onMenuClick={handleToggle}
        userName={user?.name}
        onLogout={handleLogout}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} onRename={renameProject} />
        <MainContent columns={columns} />
      </div>
    </div>
  );
}