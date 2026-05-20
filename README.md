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
- Token JWT stocké dans `localStorage` (7 jours)
- Redirection post-inscription → `/login`, post-connexion → `/biens`
- Déconnexion avec nettoyage du `localStorage`

### Dashboard
- Sidebar avec navigation et infos utilisateur dynamiques
- Layout responsive (sidebar desktop, menu mobile)

### Gestion des biens
- Lister, créer, supprimer un bien via popup
- Totaux entrées / sorties / solde calculés depuis les transactions
- Recherche en temps réel

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

---

## Architecture

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx          # Sidebar + navbar
│   └── biens/
│       ├── page.tsx        # Liste des biens
│       └── [id]/
│           ├── page.tsx
│           └── modifier/page.tsx
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   └── login/route.ts
│   └── biens/
│       ├── route.ts
│       └── [id]/route.ts
├── not-found.tsx
└── page.tsx                # Landing page

lib/
├── auth.ts                 # Vérification JWT
├── userStore.ts            # CRUD utilisateurs
├── propertyStore.ts        # CRUD biens
└── transactionStore.ts     # CRUD transactions + calcul totaux

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

Le stockage JSON est suffisant pour prototyper. Pour la production, migrer vers PostgreSQL ou SQLite avec Prisma.

## Prochaines étapes

1. Implémenter le détail d'un bien avec tableau mensuel des transactions.
2. Ajouter / modifier / supprimer des transactions.
3. Graphiques d'évolution (Recharts ou Chart.js).
4. Sessions serveur avec cookies HTTPOnly.
5. Migration vers une vraie base de données.
