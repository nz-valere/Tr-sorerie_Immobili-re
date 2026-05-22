# ValTreso — Suivi de trésorerie

Application Next.js full-stack pour gérer des biens et suivre les entrées/sorties de trésorerie par période.

## Démarrage rapide

### Prérequis

- Node.js 20+
- `pnpm` recommandé (`npm` fonctionne aussi)

### Installation

```bash
pnpm install
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```bash
JWT_SECRET=change-this-to-a-long-random-value
```

### Lancer le projet

```bash
pnpm dev
```

Puis ouvrir http://localhost:3000.

---

## Ce qui est en place

### Authentification
- Inscription (`/register`) et connexion (`/login`)
- Hash des mots de passe avec `bcryptjs`
- Token JWT stocké dans `localStorage` (7 jours) — à migrer vers cookies HTTPOnly en production
- Redirection post-inscription → `/login`, post-connexion → `/biens`
- Déconnexion avec nettoyage du `localStorage`

### Dashboard
- Sidebar avec navigation et infos utilisateur dynamiques
- Layout responsive (sidebar desktop, menu mobile)
- Vue globale : total entrées, sorties, solde, nombre de biens
- Graphique en barres mensuel (Recharts)
- Graphiques en anneau par catégorie (entrées et sorties)
- Liste des biens avec accès rapide

### Gestion des biens
- Lister, créer, supprimer un bien via popup
- Modifier un bien (nom, adresse)
- Totaux entrées / sorties / solde calculés depuis les transactions
- Recherche en temps réel

### Suivi de trésorerie
- Page détail d'un bien avec tableau mensuel complet (12 mois)
- Ajouter, modifier, supprimer des transactions par bien et par année
- Filtrage par année
- Totaux annuels recalculés en temps réel

---

## API

### Auth

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription `{ name, email, password }` |
| `POST` | `/api/auth/login` | Connexion `{ email, password }` → `{ token, user }` |

### Biens *(Authorization: Bearer `<token>` requis)*

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/biens` | Liste des biens avec totaux |
| `POST` | `/api/biens` | Créer un bien `{ name, address }` |
| `GET` | `/api/biens/:id` | Détail d'un bien |
| `PUT` | `/api/biens/:id` | Modifier `{ name, address }` |
| `DELETE` | `/api/biens/:id` | Supprimer (supprime aussi les transactions liées) |

### Transactions *(Authorization: Bearer `<token>` requis)*

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/biens/:id/transactions?year=2026` | Liste des transactions d'un bien pour une année |
| `POST` | `/api/biens/:id/transactions` | Créer une transaction `{ month, year, type, amount, label, category }` |
| `PUT` | `/api/biens/:id/transactions/:txId` | Modifier `{ amount, label, category }` |
| `DELETE` | `/api/biens/:id/transactions/:txId` | Supprimer une transaction |

---

## Architecture

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Sidebar + navbar
│   ├── dashboard/page.tsx      # Dashboard global
│   └── biens/
│       ├── page.tsx            # Liste des biens
│       └── [id]/
│           ├── page.tsx        # Détail + tableau transactions
│           └── modifier/page.tsx
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   └── login/route.ts
│   ├── biens/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       └── transactions/
│   │           ├── route.ts
│   │           └── [txId]/route.ts
│   └── dashboard/route.ts
├── not-found.tsx
└── page.tsx                    # Landing page

lib/
├── auth.ts                     # Vérification JWT
├── userStore.ts                # CRUD utilisateurs
├── propertyStore.ts            # CRUD biens
└── transactionStore.ts         # CRUD transactions + calcul totaux

data/
├── users.json
├── properties.json
└── transactions.json
```

---

## Modèles de données

```ts
User        { id, name, email, passwordHash }
Property    { id, user_id, name, address }
Transaction { id, property_id, month, year, type: "entrée"|"sortie", amount, label, category }
```

---

## Notes techniques

- **Auth** : JWT via `Authorization: Bearer <token>`, token stocké dans `localStorage`. À migrer vers cookies HTTPOnly pour la production.
- **Stockage** : fichiers JSON dans `data/`. Suffisant pour prototyper, à remplacer par PostgreSQL ou SQLite avec Prisma en production.

## Prochaines étapes

1. Protection des routes (redirection si non connecté).
2. Sessions serveur avec cookies HTTPOnly.
3. Migration vers une vraie base de données.
