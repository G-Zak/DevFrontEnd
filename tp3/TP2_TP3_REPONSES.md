# Reponses TP2 et TP3 (explications simples)

Ce document explique les reponses aux questions du TP2 et TP3 avec des mots simples, pour quelqu'un qui debute en React.

## TP2 - Auth Context et Layout protege

### Q2 - Pourquoi `throw` dans `useAuth()` ?
Si on utilise `useAuth()` en dehors du `AuthProvider`, React n'a pas de valeur a donner.
Le `throw` affiche une erreur claire tout de suite.
Sans ca, on aurait des bugs plus difficiles a comprendre.

### Q3 - Pourquoi utiliser Context au lieu des props ?
Sans Context, on doit passer `user` et `dispatch` de composant en composant, meme quand certains composants n'en ont pas besoin.
C'est ce qu'on appelle le "prop drilling".
Le Context evite ca et rend le code plus propre.

### Q4 - Pourquoi `e.preventDefault()` dans le formulaire ?
Un formulaire HTML recharge la page par defaut quand on clique sur "submit".
`e.preventDefault()` bloque ce rechargement.
Comme ca, React garde l'etat et on fait notre logique de login sans reset.

### Q5 - Pourquoi enlever le password du user avant stockage ?
Le mot de passe ne doit jamais rester en clair dans un state global.
On garde seulement les infos utiles (`id`, `email`, `name`).
C'est une bonne pratique de securite.

### Q6 - Pourquoi separer `Dashboard` de `App` ?
`App` doit surtout gerer les routes ou la logique globale.
`Dashboard` contient son propre ecran et ses donnees.
Cette separation rend le code plus lisible et plus facile a maintenir.

### Q7 - Test du login/logout attendu
- Connexion avec `admin@taskflow.com / admin123`.
- Affichage du dashboard.
- Clic sur "Deconnexion".
- Retour a la page de login.

Si ce flux marche, la partie auth est correcte.

### Q8 - Flux de deconnexion (simple)
1. Clic bouton dans `Header`.
2. Appel de `onLogout` (prop).
3. `dispatch({ type: 'LOGOUT' })` dans le reducer.
4. `user` devient `null`.
5. L'app rerender et redirige/affiche la page login.

## TP3 - Router, Axios et CRUD

### Q1 - Pourquoi `<Navigate />` au lieu de `navigate()` dans `ProtectedRoute` ?
`ProtectedRoute` decide quoi afficher pendant le rendu.
`<Navigate />` est un composant React, donc parfait dans le `return`.
Le hook `navigate()` sert surtout dans des fonctions/effects, pas directement comme rendu conditionnel principal.

### Q2 - `navigate(from)` vs `navigate(from, { replace: true })`
- `navigate(from)`: ajoute une entree dans l'historique.
- `replace: true`: remplace l'entree actuelle.

Pour un login, `replace: true` est mieux pour eviter de revenir sur la page login avec le bouton retour.

### Q3 - Pourquoi `setProjects(prev => [...prev, data])` apres POST ?
Le serveur renvoie deja le projet cree.
On met a jour l'etat local directement, c'est rapide et fluide.
On evite un nouvel appel GET inutile.

### Q4 - Pourquoi les routes protegees fonctionnent ?
`ProtectedRoute` verifie si `state.user` existe.
- Si non: redirection vers `/login`.
- Si oui: affichage de la page demandee.

Donc on ne peut pas ouvrir `/dashboard` ou `/projects/:id` sans login.

### Q5 - Difference `NavLink` vs `Link`
`NavLink` sait si le lien est actif (route actuelle), donc on peut appliquer une classe active automatiquement.
`Link` fait la navigation mais ne donne pas l'etat actif.

### Q6 - Pourquoi `ProjectForm` reutilisable est utile ?
Le meme composant peut servir pour:
- Creer un projet (POST, champs vides)
- Modifier un projet (PUT, champs pre-remplis)

On gagne du temps et on evite de dupliquer le code.

## Resume tres court
- TP2: gestion de connexion centralisee avec Context + protection de l'interface.
- TP3: navigation avec React Router + appels API avec Axios + operations CRUD de base.

Si ces flux fonctionnent en test manuel, le rendu est pret.
