@AGENTS.md
# CLAUDE.md — Application de Suivi de Trésorerie Immobilière

## Description du projet

Application web de gestion de trésorerie pour des biens immobiliers.
Elle permet à un utilisateur de s'inscrire, de se connecter, de créer et gérer ses biens immobiliers,
et d'enregistrer les entrées et sorties d'argent par période (mois/année) pour chaque bien.

## Fonctionnalités principales

### Authentification
- Inscription (nom, email, mot de passe)
- Connexion / Déconnexion
- Sessions protégées (routes privées inaccessibles sans connexion mais on vas le faire apres)

### Gestion des biens immobiliers
- Créer un bien (nom du bien, adresse)
- Lister tous les biens de l'utilisateur connecté
- Voir le détail d'un bien

### Suivi de trésorerie par bien
- Sélectionner une période (année)
- Tableau mensuel (lignes = mois de janvier à décembre, colonnes = Entrées / Sorties)
- Ajouter, modifier, supprimer des entrées et sorties pour chaque mois

## Stack technique (à définir / adapter)

- **Frontend** : React + TypeScript
- **Backend** : Next.js full-stack
- **Base de données** : PostgreSQL (ou SQLite pour le développement local)
- **Auth** : JWT ou sessions + bcrypt pour les mots de passe
- **Graphiques (bonus)** : Recharts ou Chart.js

## Structure des données (modèle simplifié)

```
User
  - id, email, password_hash, name

Property (bien immobilier)
  - id, user_id, name, address

Transaction
  - id, property_id, month, year, type (entrée | sortie), category, amount, label

Category
  - id, name, transaction_type (entrée | sortie)
```