# TaskFlow Next.js TP — Checklist Complète

## 📋 Objectif
Construire une app de gestion de projets avec **Server Actions**, **API Routes** et **Auth par cookies** en Next.js 14+

---

## ✅ Partie 1 : Server Actions — Ajouter un projet

### 1.1 Créer le fichier d'actions
- [ ] Créer `app/actions/projects.ts`
- [ ] Ajouter la directive `'use server'` en haut du fichier
- [ ] Importer `revalidatePath` de `'next/cache'`
- [ ] Créer la fonction `addProject(formData: FormData)`
  - Extraire `name` et `color` de `formData`
  - Faire un POST vers `http://localhost:4000/projects`
  - Appeler `revalidatePath('/dashboard')`

### 1.2 Créer le composant formulaire
- [ ] Créer `app/dashboard/AddProjectForm.tsx`
- [ ] Marquer le composant comme `'use client'`
- [ ] Créer un sous-composant `SubmitButton()` avec `useFormStatus()`
- [ ] Créer le formulaire avec les inputs :
  - Input text pour le nom du projet
  - Input color pour la couleur
  - Bouton "Nouveau projet" désactivé pendant l'envoi

### 1.3 Intégrer dans le Dashboard
- [ ] Modifier `app/dashboard/page.tsx`
- [ ] Importer `AddProjectForm`
- [ ] Faire un fetch GET vers `http://localhost:4000/projects` (avec `cache: 'no-store'`)
- [ ] Afficher la liste des projets

### 1.4 Tester
- [ ] Ajouter un projet via le formulaire
- [ ] Vérifier que la page se rafraîchit automatiquement

### 📝 Question
**Q1**: En React SPA, que fallait-il faire après un POST pour voir le nouveau projet ? (indice : `setProjects`). Ici ?

---

## ✅ Partie 2 : Server Actions — Renommer et supprimer

### 2.1 Ajouter `renameProject`
- [ ] Dans `app/actions/projects.ts`, créer la fonction `renameProject(formData: FormData)`
  - Extraire `id` et `newName`
  - Faire un PUT vers `http://localhost:4000/projects/{id}`
  - Le body doit contenir : `{ name: newName, color }`
  - Appeler `revalidatePath('/dashboard')`

### 2.2 Ajouter `deleteProject`
- [ ] Dans `app/actions/projects.ts`, créer la fonction `deleteProject(formData: FormData)`
  - Extraire `id`
  - Faire un DELETE vers `http://localhost:4000/projects/{id}`
  - Appeler `revalidatePath('/dashboard')`

### 2.3 Ajouter les boutons dans le Dashboard
- [ ] Modifier `app/dashboard/page.tsx`
- [ ] Dans la boucle `projects.map()`, afficher pour chaque projet :
  - Un carré de couleur (background = `p.color`)
  - Un lien vers `/projects/{p.id}`
  - Un bouton delete (formulaire avec input hidden + bouton 🗑️)
  - (Optionnel) Un bouton rename

### 2.4 Tester
- [ ] Supprimer un projet via le bouton 🗑️
- [ ] Vérifier que le projet disparaît immédiatement

### 📝 Question
**Q3**: Le bouton supprimer est un `<form>` avec un `<input type="hidden">`. Pourquoi pas un `onClick` ?

---

## ✅ Partie 3 : API Routes — Backend intégré

### 3.1 Créer GET et POST
- [ ] Créer `app/api/projects/route.ts`
- [ ] Importer `NextResponse`, `fs`, `path`
- [ ] Créer deux fonctions utilitaires :
  - `readDB()` : lire `db.json` depuis la racine du projet
  - `writeDB(data)` : écrire dans `db.json`
- [ ] Implémenter `export async function GET()` :
  - Retourner `db.projects` en JSON
- [ ] Implémenter `export async function POST(request: Request)` :
  - Extraire `name` et `color` du body
  - Créer un nouveau projet avec `id: String(Date.now())`
  - Ajouter à `db.projects` et sauvegarder
  - Retourner le nouveau projet (status 201)

### 3.2 Mettre à jour les Server Actions
- [ ] Modifier `app/actions/projects.ts`
- [ ] Remplacer `http://localhost:4000/projects` par :
  ```
  ${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/projects
  ```
- [ ] Modifier `app/dashboard/page.tsx` de la même manière
- [ ] **Arrêter json-server** (plus besoin !)

### 3.3 Créer l'API Route dynamique
- [ ] Créer `app/api/projects/[id]/route.ts`
- [ ] Implémenter `export async function GET(request, { params })` :
  - Chercher le projet par id
  - Retourner le projet ou un 404
- [ ] Implémenter `export async function PUT(request, { params })` :
  - Modifier le projet (name, color)
  - Sauvegarder et retourner le projet mis à jour
- [ ] Implémenter `export async function DELETE(request, { params })` :
  - Supprimer le projet du tableau
  - Sauvegarder et retourner un 200 OK

### 3.4 Tester
- [ ] Naviguer vers `http://localhost:3000/api/projects` dans le navigateur
- [ ] Voir la liste JSON des projets
- [ ] Ajouter, modifier, supprimer un projet
- [ ] Vérifier que tout fonctionne SANS json-server

### 📝 Questions
**Q4**: Testez http://localhost:3000/api/projects dans le navigateur. Que voyez-vous ?

**Q5**: Quelle est la différence entre une API Route et une Server Action ?

---

## ✅ Partie 4 : Auth avec cookies

### 4.1 Créer la Server Action Login
- [ ] Créer `app/actions/auth.ts`
- [ ] Ajouter `'use server'` en haut
- [ ] Importer `cookies` de `'next/headers'` et `redirect` de `'next/navigation'`
- [ ] Créer `export async function login(prevState: any, formData: FormData)` :
  - Extraire `email` et `password`
  - Vérifier : `email === 'admin@taskflow.com'` et `password === 'password123'`
  - Si erreur → retourner `{ error: 'Email ou mot de passe incorrect' }`
  - Sinon → créer un cookie `session` avec :
    ```json
    { "email": "...", "name": "Admin", "role": "admin" }
    ```
  - Options du cookie : `httpOnly: true`, `secure: false`, `maxAge: 3600`, `path: '/'`
  - Rediriger vers `/dashboard`
- [ ] Créer `export async function logoutAction()` :
  - Supprimer le cookie `session`
  - Rediriger vers `/login`

### 4.2 Modifier la page Login
- [ ] Modifier `app/login/page.tsx`
- [ ] Marquer comme `'use client'`
- [ ] Importer `useActionState` de `'react'` et `login` des actions
- [ ] Utiliser `useActionState` :
  ```js
  const [state, formAction, pending] = useActionState(login, null);
  ```
- [ ] Créer un formulaire avec :
  - Input email
  - Input password
  - Bouton submit (désactivé pendant l'envoi)
  - Afficher `state?.error` si erreur

### 4.3 Tester
- [ ] Aller à `http://localhost:3000/login`
- [ ] Entrer `admin@taskflow.com` / `password123`
- [ ] Être redirigé vers `/dashboard`

### 📝 Question
**Q6**: Comparez ce Login avec celui de React SPA. Combien de `useState` en moins ?

---

## ✅ Partie 5 : Middleware

### 5.1 Créer le middleware
- [ ] Créer `middleware.ts` à la **RACINE du projet** (pas dans `app/`)
- [ ] Importer `NextResponse` et `type { NextRequest }` de `'next/server'`
- [ ] Créer la fonction `middleware(request: NextRequest)` :
  - Lire le cookie `session`
  - Si pas de cookie → rediriger vers `/login`
  - Sinon → laisser passer avec `NextResponse.next()`
- [ ] Exporter la config pour protéger les routes :
  ```js
  export const config = {
    matcher: ['/dashboard/:path*', '/projects/:path*'],
  };
  ```

### 5.2 Tester
- [ ] Supprimer le cookie `session` (F12 > Application > Cookies)
- [ ] Naviguer vers `http://localhost:3000/dashboard`
- [ ] Vérifier qu'on est redirigé vers `/login`

### 📝 Question
**Q8**: En React SPA, ProtectedRoute affichait brièvement le Dashboard avant de rediriger. Ici, que se passe-t-il ?

**Q9**: Le middleware.ts est à la racine, pas dans app/. Pourquoi ?

---

## ✅ Partie 6 : Logout + Afficher le user

### 6.1 Créer le bouton Logout
- [ ] Créer `app/components/LogoutButton.tsx`
- [ ] Marquer comme `'use client'`
- [ ] Importer `logoutAction` des actions
- [ ] Créer un formulaire avec un bouton submit :
  ```html
  <form action={logoutAction}>
    <button type="submit">Déconnexion</button>
  </form>
  ```

### 6.2 Modifier le layout
- [ ] Modifier `app/layout.tsx`
- [ ] Importer `cookies` de `'next/headers'` et `LogoutButton`
- [ ] Rendre le layout `async` (Server Component)
- [ ] Lire le cookie `session` et parser l'utilisateur
- [ ] Ajouter un header avec :
  - Le nom de l'utilisateur s'il est connecté
  - Bouton Logout s'il est connecté
  - Lien Login sinon

### 6.3 Tester
- [ ] Se connecter à `/login`
- [ ] Voir le nom de l'utilisateur dans le header
- [ ] Cliquer sur "Déconnexion"
- [ ] Être redirigé vers `/login`

### 📝 Question
**Q10**: Le layout est un Server Component. Il lit le cookie DIRECTEMENT avec `cookies()`. En React SPA, comment faisait-on ?

---

## 📚 Partie 7 : Questions de réflexion

- [ ] **Q11**: Server Actions vs API Routes — lequel utiliseriez-vous pour un formulaire de création de projet ? Pour une app mobile qui consomme la même API ?

- [ ] **Q12**: En React SPA, l'auth était : Context + useReducer + JWT mémoire + ProtectedRoute. En Next.js c'est : cookies + middleware. Quel avantage de sécurité ?

- [ ] **Q13**: Si vous arrêtez json-server, les API Routes fonctionnent-elles toujours ? Pourquoi ?

- [ ] **Q14**: Le cookie est HttpOnly. Un script XSS injecté dans la page peut-il le voler ?

---

## 📁 Structure finale du projet

```
taskflow-next/
├── app/
│   ├── layout.tsx                    // Header + cookies() + LogoutButton
│   ├── page.tsx                      // Accueil
│   ├── login/
│   │   └── page.tsx                  // 'use client' + useActionState + login
│   ├── dashboard/
│   │   ├── page.tsx                  // Server Component + fetch + AddProjectForm
│   │   └── AddProjectForm.tsx        // 'use client' + form action={addProject}
│   ├── projects/[id]/
│   │   └── page.tsx                  // Server Component + fetch par id
│   ├── actions/
│   │   ├── projects.ts               // 'use server' : add, rename, delete
│   │   └── auth.ts                   // 'use server' : login, logout
│   ├── api/
│   │   └── projects/
│   │       ├── route.ts              // GET + POST
│   │       └── [id]/
│   │           └── route.ts          // GET + PUT + DELETE
│   └── components/
│       └── LogoutButton.tsx          // 'use client' + form action={logout}
├── middleware.ts                      // Protège /dashboard et /projects/*
├── db.json                            // Données (lues par les API Routes)
├── package.json
├── tsconfig.json
└── TODO.md                            // Ce fichier !
```

---

## 🚀 Commandes utiles

```bash
# Démarrer le serveur Next.js
npm run dev

# Lancer json-server (avant partie 3)
json-server --watch db.json --port 4000

# Après partie 3 : arrêter json-server et tout passer par les API Routes
```

---

## 💡 Points clés à retenir

| Concept | Explication |
|---------|------------|
| **'use server'** | Code qui s'exécute TOUJOURS sur le serveur, jamais envoyé au navigateur |
| **'use client'** | Code qui s'exécute dans le navigateur (React classique) |
| **Server Actions** | Fonctions serveur appelées par des formulaires HTML natifs (pas d'API à créer) |
| **API Routes** | Endpoints HTTP classiques (`/api/*`), consommables par n'importe quel client |
| **revalidatePath()** | Force Next.js à regénérer la page statique (ISR) |
| **Middleware** | Intercepte les requêtes AVANT que la page ne se charge |
| **HttpOnly cookies** | Protégés contre les attaques XSS (invisible pour JS) |
| **useFormStatus()** | Hook React pour tracker l'état d'un formulaire (doit être dans un enfant du `<form>`) |
| **useActionState()** | Hook React pour utiliser une Server Action avec état et loading |

---

## ✨ Bon courage ! 🎯
