import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  renameProject?: (project: Project) => void;
  deleteProject?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, renameProject, deleteProject }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.row}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            {(renameProject || deleteProject) && (
              <div className={styles.actions}>
                {renameProject && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => renameProject(p)}
                    aria-label={`Renommer ${p.name}`}
                  >
                    Renommer
                  </button>
                )}
                {deleteProject && (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => deleteProject(p.id)}
                    aria-label={`Supprimer ${p.name}`}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
