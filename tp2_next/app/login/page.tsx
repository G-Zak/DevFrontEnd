'use client';

import { useFormState } from 'react-dom';
import { login } from '../actions/auth';

export default function LoginPage() {
  const [state, formAction, pending] = useFormState(login, null);

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 400,
        margin: '0 auto',
        marginTop: '3rem',
      }}
    >
      <h1 style={{ color: '#1B8C3E', textAlign: 'center' }}>TaskFlow</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Connectez-vous pour continuer
      </p>

      {state?.error && (
        <div
          style={{
            background: '#fee',
            border: '1px solid #f99',
            color: '#c33',
            padding: '12px',
            borderRadius: 4,
            marginBottom: 16,
            fontSize: '14px',
          }}
        >
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue="admin@taskflow.com"
          required
          style={{
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          defaultValue="password123"
          required
          style={{
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: 10,
            background: '#1B8C3E',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          {pending ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '2rem' }}>
        💡 Les identifiants sont déjà remplis
      </p>
    </div>
  );
}
