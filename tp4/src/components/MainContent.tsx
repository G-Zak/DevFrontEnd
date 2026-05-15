import styles from './MainContent.module.css';

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

interface MainContentProps {
  columns: Column[];
  error?: string | null;
}

export default function MainContent({ columns, error }: MainContentProps) {
  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>{error}</div>
      </main>
    );
  }

  if (columns.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>
          Aucune colonne trouvee. Ajoutez des colonnes dans db.json pour afficher le Kanban.
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.board}>
        {columns.map((col) => (
          <div key={col.id} className={styles.column}>
            <h3 className={styles.colTitle}>
              {col.title} <span className={styles.count}>({col.tasks.length})</span>
            </h3>
            {col.tasks.map((task, i) => (
              <div key={`${col.id}-${i}`} className={styles.card}>
                {task}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}