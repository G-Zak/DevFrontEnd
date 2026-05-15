import AddProjectForm from './AddProjectForm';
import { deleteProject, renameProject } from '../actions/projects';

const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export default async function DashboardPage() {
  const res = await fetch(`${API_URL}/api/projects`, {
    cache: 'no-store',
  });
  const projects = await res.json();

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: '#1B8C3E' }}>Dashboard</h1>

      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Créer un nouveau projet</h2>
        <AddProjectForm />
      </div>

      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '2rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Vos projets</h2>

        {projects.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun projet pour le moment.</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {projects.map((p: any) => (
              <li
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '12px 1fr auto auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: p.color,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <a
                  href={`/projects/${p.id}`}
                  style={{
                    color: '#1B8C3E',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  {p.name}
                </a>
                <form
                  action={renameProject}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    margin: 0,
                  }}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    name="newName"
                    defaultValue={p.name}
                    aria-label={`Renommer ${p.name}`}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      minWidth: 180,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#1B8C3E',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: '6px 10px',
                    }}
                  >
                    Renommer
                  </button>
                </form>
                <form
                  action={deleteProject}
                  style={{
                    display: 'inline',
                    margin: 0,
                  }}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px',
                    }}
                    title="Supprimer le projet"
                  >
                    🗑️
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
