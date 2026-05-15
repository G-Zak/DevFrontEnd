import { memo } from 'react';
import styles from './Sidebar.module.css';
import type { Project } from '../hooks/useProjects';

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
}

function Sidebar({ projects, isOpen, onRename }: SidebarProps) {
  console.log('Sidebar re-render');

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.item}>
            <span className={styles.dot} style={{ background: p.color }} />
            <span className={styles.name}>{p.name}</span>
            {onRename && (
              <button type="button" className={styles.actionBtn} onClick={() => onRename(p)}>
                Renommer
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default memo(Sidebar);