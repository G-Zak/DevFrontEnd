import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les donnees du board. Verifiez que l'API (json-server) est lancee sur http://localhost:4000.");
      }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  // POST (fourni)
  async function addProject(name: string, color: string) {
    const { data } = await api.post('/projects', { name, color });
    setProjects(prev => [...prev, data]);
  }

  // À TOI : RENAME
  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName.trim() === '' || newName === project.name) return;

    const { data } = await api.put(`/projects/${project.id}`, { ...project, name: newName });
    setProjects(prev => prev.map(p => (p.id === project.id ? data : p)));
  }

  // À TOI : DELETE
  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} renameProject={renameProject} deleteProject={deleteProject} />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} error={error} />
        </div>
      </div>
    </div>
  );
}