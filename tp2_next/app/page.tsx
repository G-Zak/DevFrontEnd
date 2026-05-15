export default function HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ color: '#1B8C3E' }}>Bienvenue sur TaskFlow</h1>
      <p>
        TaskFlow est une application de gestion de projets construite avec
        Next.js 14, Server Actions et API Routes.
      </p>
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2>Fonctionnalités</h2>
        <ul>
          <li>✅ Server Actions pour les formulaires</li>
          <li>✅ API Routes comme backend intégré</li>
          <li>✅ Authentification par cookies HttpOnly</li>
          <li>✅ Middleware pour protéger les routes</li>
          <li>✅ Gestion complète de projets (CRUD)</li>
        </ul>
      </div>
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '1.5rem',
        }}
      >
        <h2>Credentials de test</h2>
        <p>
          <strong>Email:</strong> admin@taskflow.com
        </p>
        <p>
          <strong>Mot de passe:</strong> password123
        </p>
      </div>
    </div>
  );
}
