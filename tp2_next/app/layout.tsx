import { cookies } from 'next/headers';
import LogoutButton from './components/LogoutButton';
import './globals.css';

export const metadata = {
  title: 'TaskFlow',
  description: 'Project management app with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const user = session ? JSON.parse(session.value) : null;

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <header
          style={{
            background: '#1B8C3E',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0 }}>TaskFlow</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user && <span style={{ fontSize: '14px' }}>{user.name}</span>}
            {user && <LogoutButton />}
            {!user && (
              <a
                href="/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  padding: '4px 12px',
                  border: '1px solid white',
                  borderRadius: 4,
                }}
              >
                Login
              </a>
            )}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
