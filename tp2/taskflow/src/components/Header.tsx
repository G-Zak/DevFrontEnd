import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string | null;
  onLogout?: () => void;
}

export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {
  const initials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'TF';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          ☰
        </button>
        <h1 className={styles.logo}>{title}</h1>
      </div>
      <div className={styles.right}>
        {userName && <span className={styles.user}>{userName}</span>}
        {onLogout && (
          <button className={styles.logout} onClick={onLogout}>
            Déconnexion
          </button>
        )}
        <span className={styles.avatar}>{initials}</span>
      </div>
    </header>
  );
}