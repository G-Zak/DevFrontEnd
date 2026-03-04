import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    console.log('useEffect déclenché !');
    
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          fetch('http://localhost:4000/projects'),
          fetch('http://localhost:4000/columns'),
        ]);

        if (!projRes.ok || !colRes.ok) {
          throw new Error('Erreur HTTP lors du fetch');
        }

        const projData = await projRes.json();
        const colData = await colRes.json();
        
        console.log('Projets reçus:', projData);
        console.log('Colonnes reçues:', colData);

        setProjects(projData);
        setColumns(colData);
        
      } catch (err) {
        console.error('Erreur lors du fetch:', err);
        setError('Impossible de charger les données. Vérifiez que json-server est lancé.');
      } finally {
        setLoading(false);
        console.log('Chargement terminé');
      }
    }
    
    fetchData();
    
  }, []); 

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        ⏳ Chargement des données...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        color: '#e74c3c', 
        textAlign: 'center' 
      }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh' 
    }}>
      <Header 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(prev => !prev)} 
      />
      
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <MainContent columns={columns} />
      </div>
    </div>
  );
}