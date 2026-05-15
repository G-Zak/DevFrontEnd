# TaskFlow Next.js — Projet Complet

Application de gestion de projets avec **Server Actions**, **API Routes** et **Authentification par cookies** en Next.js 14+.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le serveur démarre sur [http://localhost:3000](http://localhost:3000).

## 📋 Credentials de test

```
Email: admin@taskflow.com
Mot de passe: password123
```

## 📁 Structure du projet

```
taskflow-next/
├── app/
│   ├── layout.tsx                    // Header + cookies + LogoutButton
│   ├── page.tsx                      // Accueil
│   ├── globals.css                   // Styles globaux
│   ├── login/
│   │   └── page.tsx                  // Login avec useActionState
│   ├── dashboard/
│   │   ├── page.tsx                  // Dashboard avec liste des projets
│   │   └── AddProjectForm.tsx        // Formulaire pour ajouter un projet
│   ├── projects/[id]/
│   │   └── page.tsx                  // Page détail du projet
│   ├── actions/
│   │   ├── projects.ts               // Server Actions: add, rename, delete
│   │   └── auth.ts                   // Server Actions: login, logout
│   ├── api/
│   │   └── projects/
│   │       ├── route.ts              // GET + POST /api/projects
│   │       └── [id]/
│   │           └── route.ts          // GET, PUT, DELETE /api/projects/[id]
│   └── components/
│       └── LogoutButton.tsx          // Bouton de déconnexion
├── middleware.ts                      // Protection des routes /dashboard et /projects
├── db.json                            // Base de données JSON
├── package.json
├── tsconfig.json
├── next.config.js
└── TODO.md                            // Checklist complète du TP
```

## ✨ Fonctionnalités

### ✅ Partie 1 : Server Actions — Ajouter un projet
- Création d'une Server Action `addProject`
- Composant formulaire `AddProjectForm` avec `useFormStatus`
- Intégration dans le Dashboard
- Auto-refresh avec `revalidatePath`

### ✅ Partie 2 : Server Actions — Renommer et supprimer
- Server Action `deleteProject`
- Server Action `renameProject` (bonus)
- Boutons d'action dans la liste des projets

### ✅ Partie 3 : API Routes — Backend intégré
- **GET** `/api/projects` — Retourner tous les projets
- **POST** `/api/projects` — Créer un projet
- **GET** `/api/projects/[id]` — Retourner un projet
- **PUT** `/api/projects/[id]` — Modifier un projet
- **DELETE** `/api/projects/[id]` — Supprimer un projet
- Les API Routes lisent/écrivent dans `db.json`

### ✅ Partie 4 : Auth avec cookies HttpOnly
- Server Action `login` avec validation
- Server Action `logout`
- Cookie `session` avec `httpOnly: true` (protection XSS)
- Page login avec `useActionState`
- Affichage de l'utilisateur dans le header

### ✅ Partie 5 : Middleware
- Protection des routes `/dashboard/*` et `/projects/*`
- Redirection automatique vers `/login` si pas de session
- Interception AVANT la génération du HTML

### ✅ Partie 6 : Logout + Afficher l'utilisateur
- Bouton `LogoutButton` dans le header
- Suppression du cookie et redirection vers login
- Affichage du nom d'utilisateur connecté

## 🧪 Tests

### Tester l'authentification
1. Aller sur `http://localhost:3000/login`
2. Entrer : `admin@taskflow.com` / `password123`
3. Être redirigé vers `/dashboard`

### Tester les Server Actions
1. Ajouter un projet via le formulaire
2. Voir la page se rafraîchir automatiquement (pas de reload!)
3. Supprimer un projet via le bouton 🗑️

### Tester les API Routes
1. Ouvrir `http://localhost:3000/api/projects` dans le navigateur
2. Voir la liste JSON des projets
3. Utiliser Postman/cURL pour tester PUT et DELETE

### Tester le Middleware
1. Supprimer le cookie `session` (F12 > Application > Cookies)
2. Taper `/dashboard` dans l'URL
3. Être redirigé vers `/login` automatiquement

### Tester la sécurité XSS
1. F12 > Application > Cookies
2. Essayer `document.cookie` dans la console
3. Le cookie `session` n'apparaît pas (HttpOnly = invisible pour JS)

## 🔑 Points clés

| Concept | Expliquation |
|---------|-------------|
| **'use server'** | Code exécuté TOUJOURS sur le serveur |
| **'use client'** | Code exécuté dans le navigateur (React classique) |
| **Server Actions** | Fonctions serveur appelées par formulaires HTML natifs |
| **API Routes** | Endpoints HTTP classiques consommables par n'importe quel client |
| **revalidatePath()** | Force Next.js à regénérer la page (ISR) |
| **Middleware** | Intercepte les requêtes AVANT la génération HTML |
| **HttpOnly cookies** | Protégés contre XSS (invisibles pour JavaScript) |

## 🛠️ Commandes

```bash
# Développement
npm run dev

# Build pour production
npm run build

# Lancer le build production
npm start

# Linting
npm run lint
```

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)

---

**Bon courage pour le TP! 🚀**
