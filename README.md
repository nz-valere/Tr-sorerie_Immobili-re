# ValTreso — Suivi de trésorerie

Application Next.js pour gérer des biens et suivre les entrées/sorties de trésorerie par période.

## Démarrage rapide

### Prérequis

- Node.js 20+ 
- Un gestionnaire de paquets compatible avec le projet: `pnpm` recommandé, `npm` fonctionne aussi

### Installation

```bash
pnpm install
```

Si vous préférez `npm`, utilisez:

```bash
npm install
```

### Variables d'environnement

Créer un fichier `.env` à la racine avec au minimum:

```bash
JWT_SECRET=change-this-to-a-long-random-value
```

Un exemple est disponible dans [.env.example](.env.example).

### Lancer le projet

```bash
pnpm dev
```

Puis ouvrir http://localhost:3000.

## Ce qui est déjà en place

- Authentification: inscription / connexion
- Pages dédiées: [/register](app/register/page.tsx) et [/login](app/login/page.tsx)
- API d'authentification: `/api/auth/register` et `/api/auth/login`
- Stockage de développement: `data/users.json`

## API d'authentification

### Inscription

`POST /api/auth/register`

Body JSON:

```json
{
	"name": "Alice",
	"email": "a@ex.com",
	"password": "secret"
}
```

Réponse: l'utilisateur créé, sans le hash du mot de passe.

### Connexion

`POST /api/auth/login`

Body JSON:

```json
{
	"email": "a@ex.com",
	"password": "secret"
}
```

Réponse:

```json
{
	"ok": true,
	"token": "<JWT>",
	"user": {
		"id": 1,
		"name": "Alice",
		"email": "a@ex.com"
	}
}
```

## Architecture actuelle

- [app/api/auth/register/route.ts](app/api/auth/register/route.ts)
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
- [lib/userStore.ts](lib/userStore.ts)

## Notes techniques

Pour l’instant, les utilisateurs sont stockés dans `data/users.json`. C’est suffisant pour prototyper, mais il faudra migrer vers SQLite ou Postgres avec Prisma pour une version fiable en production.

## Prochaines étapes

1. Ajouter des sessions serveur avec cookies HTTPOnly.
2. Remplacer le stockage JSON par une vraie base de données.
3. Créer les modèles `Property` et `Transaction`.
4. Construire le dashboard principal.


