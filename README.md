# ValTreso — Suivi de trésorerie

Application Next.js full-stack pour gérer des biens et suivre les entrées/sorties de trésorerie par période.

## Démarrage rapide

### Prérequis

- Node.js 20+
- `pnpm` recommandé
- Docker (pour les tests d'intégration)

### Installation

```bash
pnpm install
npx prisma generate
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET=change-this-to-a-long-random-value
DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5433/treasury_test"
```

### Lancer le projet

```bash
pnpm dev
```

Puis ouvrir http://localhost:3000.

### Déploiement Docker

```bash
docker compose up --build
```

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
├── prisma.ts                   # Client Prisma singleton
├── userStore.ts                # CRUD utilisateurs
├── propertyStore.ts            # CRUD biens
└── transactionStore.ts         # CRUD transactions + calcul totaux

prisma/
├── schema.prisma               # Modèles de données
└── migrations/                 # Historique des migrations SQL

tests/
├── api/                        # Tests unitaires des routes API
├── lib/                        # Tests unitaires des stores et auth
└── integration/                # Tests d'intégration (vraie DB PostgreSQL)

.github/
└── workflows/
    └── ci.yml                  # CI GitHub Actions
```

---

## Modèles de données

```ts
User        { id, name, email, passwordHash }
Property    { id, user_id, name, address }
Transaction { id, property_id, month, year, type: "entrée"|"sortie", amount, label, category }
```

---

## Tests

### Tests unitaires (Prisma mocké, pas de DB requise)

```bash
pnpm test
```

51 tests couvrant : auth, CRUD biens, CRUD transactions, dashboard, stores, `getUserFromRequest`.

### Tests d'intégration (vraie DB PostgreSQL)

Lancer un PostgreSQL local via Docker :

```bash
docker run --name treasury-test-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=treasury_test \
  -p 5433:5432 -d postgres:16
```

Puis :

```bash
pnpm test:integration
```

13 tests couvrant les stores sur une vraie base — migrations appliquées automatiquement.

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) se déclenche à chaque push sur `main` :

1. **Unit Tests** — 51 tests sans DB
2. **Integration Tests** — PostgreSQL Docker lancé automatiquement par GitHub
3. **Build Docker** — bloqué si les tests échouent
4. **Push to Docker Hub** — image `nzvalere/treasury:latest` publiée (push sur `main` uniquement)
5. **Deploy to VPS** — connexion SSH, `docker pull` + `docker compose up -d`

Secrets GitHub requis : `DATABASE_URL`, `JWT_SECRET`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.

---

## Notes techniques

- **Auth** : JWT via `Authorization: Bearer <token>`, token stocké dans `localStorage`. À migrer vers cookies HTTPOnly pour la production.
- **Base de données** : PostgreSQL via Prisma + Neon (cloud). Les migrations sont versionnées dans `prisma/migrations/`.
- **Docker** : image multi-stage optimisée, mode `standalone` Next.js.

## Prochaines étapes

1. Protection des routes (redirection si non connecté).
2. Sessions serveur avec cookies HTTPOnly.
