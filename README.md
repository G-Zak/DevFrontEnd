Q1 : Pourquoi utiliser le composant <Navigate /> plutôt que la fonction `navigate()` ici ?

Réponse
Le code s'exécute pendant la phase de rendu de React. La fonction `navigate()` doit être appelée en dehors du rendu (par exemple depuis un gestionnaire d'événements ou un `useEffect`). Utiliser `<Navigate />` est approprié quand on veut déclencher une redirection directement pendant le rendu.

Q2 : Quelle est la différence entre `navigate(from)` et `navigate(from, { replace: true })` ?

Réponse
La différence porte sur l'historique du navigateur : `navigate(from)` ajoute une nouvelle entrée dans l'historique, tandis que `navigate(from, { replace: true })` remplace l'entrée courante. Le comportement du bouton « Retour » en dépend.

Q3 : Après un POST, pourquoi utilise-t-on `setProjects(prev => [...prev, data])` plutôt qu'un re-fetch (GET) ?

Réponse
On met à jour la liste localement pour afficher immédiatement le nouveau projet à l'utilisateur et éviter une requête réseau complète et coûteuse.

Q4 : Quelle différence entre `<Link>` et `<NavLink>` ? Pourquoi choisir `NavLink` ici ?

Réponse
`<NavLink>` expose une information d'état (par exemple `isActive`) qui permet d'appliquer un style conditionnel quand l'URL correspond au lien. On l'utilise pour mettre en évidence l'élément actif dans la barre latérale.

Q5 : Ce composant sert pour le POST et pour le PUT. Qu'est-ce qui change entre les deux usages ?

Réponse
Les props. Pour un POST, les champs sont initialisés vides et la soumission crée un nouvel élément. Pour un PUT, les champs sont pré-remplis avec les données existantes et la soumission met à jour cet élément.

Q6 : Que se passe-t-il si `json-server` est arrêté et qu'on tente un POST ? Le message s'affiche-t-il ?

Réponse
Oui : la requête échoue (Network Error), Axios lance une exception qui est capturée dans le bloc `catch`. L'état d'erreur est alors mis à jour pour informer l'utilisateur.

Q7 : Avec `fetch`, un 404 ne lance pas d'erreur. Avec Axios, que se passe-t-il ?

Réponse
Axios considère les réponses HTTP 4xx/5xx comme des échecs et lance une exception, ce qui permet d'entrer directement dans le bloc `catch` pour gérer l'erreur.

---

**Séance 5 — Réponses du TP**

Q1 : Le script s'exécute-t-il lorsqu'on injecte du HTML dans le JSX ? Que fait React avec les chaînes de caractères dans le JSX ?

Réponse
Par défaut, non. React échappe automatiquement les chaînes de caractères dans le JSX pour prévenir les attaques XSS : le HTML est affiché comme texte et n'est pas interprété.

Q2 : Que se passe-t-il si on force l'injection (par exemple avec `dangerouslySetInnerHTML`) ?

Réponse
Le navigateur peut exécuter le script inclus et déclencher une alerte ou d'autres effets malveillants. `dangerouslySetInnerHTML` désactive la protection automatique de React et expose l'application aux failles XSS : ne pas laisser ce code en production.

Q3 : En ouvrant l'onglet Network et en faisant un GET `/projects`, voit-on le header `Authorization: Bearer ...` ?

Réponse
Oui. L'intercepteur Axios configuré ajoute automatiquement l'en-tête `Authorization: Bearer <token>` aux requêtes sortantes.

Q4 : Pourquoi stocker le token en mémoire (state React) plutôt que dans `localStorage` ?

Réponse
`localStorage` est accessible par n'importe quel script JavaScript de la page, ce qui augmente le risque en cas de XSS. Le state React reste en mémoire et limite l'exposition du token.

Q5 : Qu'apporte `authSlice.ts` par rapport à l'ancien `authReducer.ts` ?

Réponse
Avec Redux Toolkit, `authSlice.ts` s'appuie sur Immer : on peut écrire du code « mutable » tout en conservant l'immuabilité de l'état. Cela évite d'écrire des `switch/case` et simplifie la définition des actions.

Q6 : Combien de composants se re-rendent quand on bascule la sidebar ? Lesquels ne devraient pas ?

Réponse
Sans optimisation, des composants non liés (par exemple `MainContent`) peuvent se re-render inutilement. L'objectif est de limiter ces re-renders aux composants réellement concernés.

Q7 : Pourquoi `MainContent` ne se re-rend plus après optimisation ? Que compare `React.memo` ?

Réponse
`React.memo` effectue une comparaison superficielle (shallow compare) des props. Si la référence d'une prop (par exemple un tableau) n'a pas changé, le composant est préservé et le rendu est ignoré.

Q8 : Quelle est la différence entre `useMemo` et `useCallback` et quand les utiliser ?

Réponse
`useMemo` mémorise le résultat d'un calcul coûteux et retourne une valeur, `useCallback` mémorise la référence d'une fonction pour éviter sa recréation. Utilisez `useCallback` quand vous passez une fonction à un enfant optimisé avec `React.memo`.

Q9 : Pour chaque action, notez quels composants se re-rendent, combien de temps prend le render, et s'il reste des re-renders inutiles après optimisation.

Réponse
Après optimisation (avec `React.memo` et `useCallback`), lors du toggle de la sidebar, seuls `Dashboard` et `Sidebar` se re-rendent. `MainContent` est préservé, ce qui réduit le temps de rendu observé dans le Profiler.
