# Ciel — météo & prévisions

Application web de météo permettant de rechercher une ville n'importe où dans le monde, de consulter ses conditions actuelles, ses prévisions à 7 jours et la qualité de l'air, et de garder une liste de villes favorites à portée de main. Construite avec **Next.js (App Router)**, **TypeScript** et **Tailwind CSS v4**.

## Fonctionnalités implémentées

### Recherche de villes
- Champ de recherche avec suggestions en temps réel (géocodage), débouncé (300 ms) pour éviter les appels API inutiles
- Navigation clavier complète dans les résultats (flèches, Entrée, Échap)
- Résultats désambiguïsés par région/pays (plusieurs villes peuvent porter le même nom)

### Météo & prévisions
- Conditions actuelles : température, ressenti, humidité, pression, vent (vitesse, direction, rafales), couverture nuageuse, précipitations, indice UV
- Prévisions journalières sur 7 jours avec températures min/max, icône et probabilité de précipitation
- Lever et coucher du soleil du jour
- Carte de localisation intégrée (OpenStreetMap)
- Fond du bandeau d'en-tête généré dynamiquement à partir de la météo réelle et de l'heure du jour/nuit de la ville consultée (ciel dégagé, nuageux, pluie, neige, orage — chacun avec son propre dégradé)

### Gestion des favoris
- Ajout/suppression depuis la page d'accueil ou la page de détail (bouton étoile)
- Persistance via le `localStorage` du navigateur — aucun compte, aucune base de données requise, conformément au cahier des charges
- Section dédiée sur la page d'accueil avec la météo actuelle de chaque ville favorite, triée par ajout le plus récent
- Indicateur visuel (étoile pleine/vide) cohérent sur toutes les pages

### Fonctionnalité originale : qualité de l'air
Intégration de l'**API Air Quality d'Open-Meteo** (gratuite, sans clé), affichée sur la page de détail de chaque ville :
- Indice de qualité de l'air européen (0–100+), avec badge coloré selon le niveau (bon → extrême)
- Détail des polluants : PM2.5, PM10, ozone, dioxyde d'azote
- Conseil contextuel adapté au niveau de pollution (ex. limiter les efforts en extérieur)

Cette fonctionnalité va au-delà d'un simple affichage météo : elle apporte une information de santé publique concrète et exploitable, à partir d'une seconde API externe correctement intégrée avec son propre cache et sa propre gestion d'erreur (une indisponibilité de l'API qualité de l'air n'empêche jamais l'affichage du reste de la page).

### États de chargement & gestion des erreurs
- `loading.tsx` avec squelettes de chargement sur la page de détail d'une ville
- `error.tsx` avec bouton de nouvelle tentative si l'API météo est indisponible
- `not-found.tsx` dédié pour un lien de ville invalide, en plus du 404 global de l'application

## Technologies utilisées

| Techno | Usage |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework, routage, Server/Client Components, Route Handlers |
| [TypeScript](https://www.typescriptlang.org) | Typage statique sur l'ensemble du code |
| [React 19](https://react.dev) | UI, `useSyncExternalStore` pour la persistance des favoris |
| [Tailwind CSS v4](https://tailwindcss.com) | Mise en page et responsive, palette de couleurs pilotée par variables CSS |
| [Open-Meteo](https://open-meteo.com) | Géocodage, météo/prévisions, qualité de l'air — API gratuite, sans clé |
| [OpenStreetMap](https://www.openstreetmap.org) | Carte de localisation embarquée |

## Instructions d'installation & lancement

Prérequis : Node.js 20+.

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd eval_next_y5

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est ensuite disponible sur [http://localhost:3000](http://localhost:3000).

Autres commandes utiles :

```bash
npm run build   # build de production
npm run start   # lance le build de production
npm run lint    # vérifie le code avec ESLint
```

## Variables d'environnement

**Aucune variable d'environnement n'est nécessaire.** Les APIs Open-Meteo (géocodage, météo, qualité de l'air) sont gratuites et ne requièrent pas de clé d'authentification. Il n'y a donc pas de fichier `.env.local` à configurer, et aucun secret n'est présent dans le dépôt.

## Choix d'architecture & composants

### Server vs Client Components
- **Server Components par défaut** : la page de détail d'une ville (`app/ville/[slug]/page.tsx`) est un Server Component asynchrone qui récupère la météo et la qualité de l'air côté serveur, en parallèle (`Promise.all`), avant d'envoyer le HTML. Les composants de présentation purs (`CurrentConditions`, `DailyForecastList`, `SunTimes`, `AirQualityCard`) sont eux aussi des Server Components : ils ne font que mettre en forme des props, sans état ni interactivité.
- **Client Components ciblés** (`"use client"`) uniquement là où une interactivité navigateur est nécessaire : le champ de recherche (`SearchBar`, état local + `fetch` débouncé), le bouton favori (`FavoriteButton`, lit/écrit le `localStorage`), la section favoris de l'accueil (`FavoritesSection`/`FavoriteCard`, doit lire le `localStorage` puis récupérer la météo de chaque favori côté client), et la carte (`LocationMap`, a besoin d'un `ResizeObserver` pour dimensionner correctement l'iframe — voir note ci-dessous).

### Récupération de données & cache
- Les appels à Open-Meteo passent par un module `lib/api/*` typé, avec `next: { revalidate }` pour mettre en cache les réponses (10 min pour la météo, 30 min pour la qualité de l'air, 1 h pour le géocodage) et éviter les appels dupliqués pour une même ville.
- Deux Route Handlers (`app/api/geocode`, `app/api/weather-summary`) exposent ces mêmes fonctions aux Client Components qui ne peuvent pas faire d'appel serveur direct (recherche en temps réel, météo des favoris).

### Routage
- Route dynamique `/ville/[slug]` où le slug encode à la fois le nom de la ville **et** ses coordonnées (`Paris@48.8566_2.3522`). Un nom de ville seul n'est pas unique (plusieurs "Paris" existent dans le monde) ; encoder les coordonnées évite un second appel de géocodage et garantit de pointer vers la bonne ville, y compris en cas d'ambiguïté.

### Favoris & persistance
- Le contexte `FavoritesContext` lit/écrit le `localStorage` via `useSyncExternalStore` plutôt qu'un `useState` + `useEffect` classique : cette API React est conçue spécifiquement pour synchroniser un état externe (ici le navigateur) sans provoquer d'incohérence entre le rendu serveur et l'hydratation client.

### Design & couleurs
Toute la palette de couleurs de l'application est centralisée dans des **variables CSS** (`app/globals.css`), y compris le mode sombre automatique (`prefers-color-scheme`). Ces variables sont ensuite exposées à Tailwind via `@theme inline`, ce qui permet d'utiliser les classes utilitaires Tailwind (`bg-sky`, `text-ink`, etc.) tout en gardant une seule source de vérité pour les couleurs — modifier l'identité visuelle de l'application se fait en un seul endroit.

Le bandeau météo de la page de détail (`CityHero`) illustre ce système : son dégradé de fond est calculé à partir du code météo et de l'heure (jour/nuit) réels de la ville consultée (`lib/sky-gradient.ts`), plutôt que d'être une couleur fixe.

## Structure du projet

```
app/
  page.tsx                 # Accueil : recherche + favoris
  layout.tsx                # Layout racine, polices, FavoritesProvider
  not-found.tsx              # 404 global
  ville/[slug]/
    page.tsx                # Détail d'une ville (Server Component)
    loading.tsx              # État de chargement
    error.tsx                # Erreur récupérable
    not-found.tsx             # Ville/slug invalide
  api/
    geocode/route.ts          # Proxy géocodage pour la recherche client
    weather-summary/route.ts   # Météo condensée pour les favoris côté client
components/                  # Composants UI réutilisables
contexts/FavoritesContext.tsx # Persistance des favoris (localStorage)
lib/
  api/                       # Client Open-Meteo (géocodage, météo, qualité de l'air)
  types.ts, slug.ts, format.ts, weather-codes.ts, sky-gradient.ts, air-quality-levels.ts
```

## Captures d'écran

<!-- Ajouter les captures ci-dessous, par exemple dans un dossier `docs/screenshots/` -->

**Page d'accueil (recherche + favoris)**

![Page d'accueil](./docs/screenshots/accueil.png)

**Résultats de recherche**

![Résultats de recherche](./docs/screenshots/recherche.png)

**Détail d'une ville (météo, prévisions, carte)**

![Détail d'une ville](./docs/screenshots/detail-ville.png)

**Gestion des favoris**

![Favoris](./docs/screenshots/favoris.png)

**Qualité de l'air (fonctionnalité originale)**

![Qualité de l'air](./docs/screenshots/qualite-air.png)
