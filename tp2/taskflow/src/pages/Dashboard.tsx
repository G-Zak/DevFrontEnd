import { useCallback, useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import useProjects, { type Project } from '../hooks/useProjects';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { projects, columns, loading, error, addProject, renameProject } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1b8c3e');

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((value) => !value);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleRename = useCallback((project: Project) => {
    renameProject(project);
  }, [renameProject]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    await addProject(name.trim(), color);
    setName('');
    setColor('#1b8c3e');
    setShowForm(false);
  }, [addProject, color, name]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        title="TaskFlow"
        onMenuClick={handleToggleSidebar}
        userName={user?.name}
        onLogout={handleLogout}
      />

      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.25rem 0' }}>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '0.7rem 1rem',
            background: '#1b8c3e',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Fermer' : 'Ajouter un projet'}
        </button>
        {error && <span style={{ color: '#b42318', alignSelf: 'center' }}>{error}</span>}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nom du projet"
            style={{ padding: '0.7rem 1rem', borderRadius: '0.75rem', border: '1px solid #c8d0d8' }}
          />
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            style={{ width: '52px', height: '40px', border: 'none', background: 'transparent' }}
          />
          <button
            type="submit"
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.7rem 1rem',
              background: '#0f172a',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Enregistrer
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} onRename={handleRename} />
        <MainContent columns={columns} />
      </div>
    </div>
  );
}