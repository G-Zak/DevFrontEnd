# TP5 — Sécurité JWT, Redux Toolkit & Performance (TaskFlow)

Objectif
-------
Ce TP explique et implémente : sécurité XSS (JSX vs dangerouslySetInnerHTML), simulation d'un JWT côté client, intercepteur Axios pour envoyer le token, migration de l'auth vers Redux Toolkit, optimisations de rendu (`React.memo`, `useCallback`) et extraction d'un custom hook `useProjects`. On termine par l'utilisation du Profiler.

Stack
-----
- Vite + React 18 + TypeScript
- @reduxjs/toolkit + react-redux
- axios + json-server

Prérequis
---------
TaskFlow des séances 1–4 fonctionnel (auth + router + CRUD + Axios). Port API attendu : `http://localhost:4000`.

Plan d'actions (résumé)
-----------------------
1. Tester la protection XSS en affichant une string contenant du HTML dans `Dashboard`.
2. Tester `dangerouslySetInnerHTML` (uniquement pour démonstration), puis supprimer.
3. Simuler un JWT côté client dans `Login.tsx` et stocker le token dans le state (pas `localStorage`).
4. Ajouter un intercepteur / helper `setAuthToken` dans `src/api/axios.ts`.
5. Migrer l'auth vers Redux Toolkit : `authSlice`, `store`, remplacer `AuthProvider` par Redux `Provider`.
6. Extraire la logique CRUD de `Dashboard` vers `src/hooks/useProjects.ts`.
7. Optimiser les composants avec `React.memo` et `useCallback`.
8. Mesurer avec React Profiler (avant / après) et capturer les captures d'écran.

Fichiers clés à créer / modifier
-------------------------------
- `src/api/axios.ts` (intercepteur + `setAuthToken`)
- `src/features/auth/authSlice.ts` (nouveau)
- `src/store.ts` (nouveau)
- `src/hooks/useProjects.ts` (nouveau)
- `src/main.tsx` (Provider store)
- `src/pages/Dashboard.tsx` (utilise `useProjects`)
- `src/components/MainContent.tsx` (export default memo(MainContent))
- `src/components/Sidebar.tsx` (memo + callbacks)

Exemples de code importants
--------------------------

1) `src/api/axios.ts` — intercepteur simple pour ajouter/supprimer Authorization

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
```

2) `src/features/auth/authSlice.ts` — modèle RTK

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User { id: string; email: string; name?: string }
interface AuthState { user: User | null; token: string | null; loading: boolean; error: string | null }

const initialState: AuthState = { user: null, token: null, loading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) { state.loading = true; state.error = null },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user; state.token = action.payload.token; state.loading = false
    },
    loginFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload },
    logout(state) { state.user = null; state.token = null; state.loading = false; state.error = null },
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
```

3) `src/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

export const store = configureStore({ reducer: { auth: authReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

4) Simuler un JWT dans `Login.tsx` (extrait)

```ts
// après authentification (fake)
const fakeToken = btoa(JSON.stringify({ userId: user.id, email: user.email, role: 'admin', exp: Date.now() + 3600000 }));
dispatch(loginSuccess({ user, token: fakeToken }));
```

5) `src/hooks/useProjects.ts` (schéma)

```ts
import { useState, useEffect } from 'react';
import api from '../api/axios';
import axios from 'axios';

export default function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([api.get('/projects'), api.get('/columns')]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(`Erreur: ${err.response?.status}`);
    }
  }

  async function renameProject(project: any) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName === project.name) return;
    try {
      const { data } = await api.put(`/projects/${project.id}`, { ...project, name: newName });
      setProjects(prev => prev.map(p => p.id === data.id ? data : p));
    } catch (err) {
      if (axios.isAxiosError(err)) setError(`Erreur: ${err.response?.status}`);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) setError(`Erreur: ${err.response?.status}`);
    }
  }

  return { projects, columns, loading, error, addProject, renameProject, deleteProject };
}
```

Optimisations Rendu
-------------------
- Envelopper composants purs avec `export default memo(Component)` pour éviter rerenders si les props sont strictement identiques.
- Utiliser `useCallback` pour passer des fonctions en props afin de conserver une référence stable et éviter de casser `memo`.

Piège fréquent :
```tsx
// Mauvais : crée une nouvelle fonction à chaque rendu -> memo ne sert à rien
<MemoizedSidebar onRename={(p) => renameProject(p)} />

// Bon : référence stable
const handleRename = useCallback((p) => renameProject(p), [renameProject]);
<MemoizedSidebar onRename={handleRename} />
```

useMemo vs useCallback
- `useMemo` : mémoïse une valeur calculée.
- `useCallback` : mémoïse une fonction (retourne une fonction stable).

Profiler (quick guide)
----------------------
1. Installer React DevTools (Chrome/Edge).  
2. Ouvrir DevTools → Profiler → Record. Interagir (toggle sidebar, ajouter projet, naviguer). Stop.  
3. Examiner la liste de composants re-rendus et le temps de rendu. Capturer screenshot avant/après `memo`.

QA synthétique (Q1–Q10)
- Q1 : Non — React échappe les strings.
- Q2 : Avec `dangerouslySetInnerHTML`, le HTML est interprété et le script peut s'exécuter.
- Q3 : Oui si `setAuthToken` a été appelé et que le token est présent.
- Q4 : `localStorage` est accessible via JS (XSS). Le state React est plus sûr car non persistant globalement.
- Q5 : RTK utilise `createSlice` + Immer : on écrit du « code mutable » mais Immer produit un nouvel état immuable.
- Q6 : Variable selon l'app, typiquement plusieurs composants parent/children — les composants sans dépendances aux props d'état ne devraient pas se re-render.
- Q7 : `React.memo` compare shallow props (référence) ; si inchangées, pas de rerender.
- Q8 : `useMemo` memoïse une valeur calculée, `useCallback` memoïse une fonction (retourne la fonction même si dépendances inchangées).
- Q10 : Mesurer avant/après et documenter captures d'écran.

Commandes utiles
-----------------
Install (RTK + react-redux) :

```bash
npm install @reduxjs/toolkit react-redux
```

Lancer l'API (si `json-server` est configuré) :

```bash
npx json-server --watch db.json --port 4000
```

Tests manuels recommandés
-------------------------
- Ouvrir DevTools → Network pour vérifier `Authorization: Bearer ...`.  
- Ouvrir DevTools → Console pour observer re-renders via `console.log` ajoutés temporairement.  
- Profiler before/after `React.memo`.

Next steps (suggestions)
-----------------------
1. Implémenter `setAuthToken` et appeler dans `AuthContext`/store subscription après login/logout.
2. Créer `authSlice` + `store.ts` et remplacer `AuthProvider` par `<Provider store={store}>` dans `src/main.tsx`.
3. Migrer `Login`, `ProtectedRoute`, `Header`, `Dashboard` pour utiliser `useSelector`/`useDispatch`.
4. Ajouter `useProjects` et refactorer `Dashboard`.
5. Appliquer `React.memo` et `useCallback`, puis profiler et capturer before/after.

Fichier créé
------------
Ce document : `docs/TP5-TaskFlow-JWT-Redux-Perf.md`

Souhaitez-vous que j'implémente automatiquement les étapes 1–4 (création `setAuthToken`, `authSlice`, `store`, et mise à jour de `main.tsx`) dans le dépôt maintenant ?
