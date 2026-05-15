import { notFound } from 'next/navigation';

const API_URL = 'http://localhost:3000';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const project = await res.json();

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a
          href="/dashboard"
          style={{
            color: '#1B8C3E',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← Retour au Dashboard
        </a>
      </div>

      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: project.color,
              display: 'inline-block',
            }}
          />
          <h1 style={{ margin: 0, color: '#1B8C3E' }}>{project.name}</h1>
        </div>

        <div style={{ color: '#666' }}>
          <p>
            <strong>ID du projet:</strong> {project.id}
          </p>
          <p>
            <strong>Couleur:</strong> {project.color}
          </p>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f9f9f9',
            borderRadius: 4,
            fontSize: '12px',
            color: '#999',
          }}
        >
          <p style={{ margin: 0 }}>
            💡 Cette page affiche les détails du projet. Vous pouvez ajouter plus
            d'informations comme les tâches, les membres, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
