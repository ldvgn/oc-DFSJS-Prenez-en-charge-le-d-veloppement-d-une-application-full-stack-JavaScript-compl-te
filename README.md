# MDD — Monde Du Dev

Application communautaire pour les développeurs : abonnements à des thèmes (topics), publication d'articles et commentaires.

## Stack technique

- [Next.js](https://nextjs.org) 16 (App Router)
- [Auth.js](https://authjs.dev) 5 (authentification par identifiants + JWT)
- [Prisma](https://www.prisma.io) 7 (ORM) avec l'adapter [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- PostgreSQL 16 (via Docker)
- TypeScript, Tailwind CSS

## Prérequis

- Node.js 20+
- Docker (pour la base de données PostgreSQL)

## Installation

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer un fichier `.env` à la racine du projet avec les variables suivantes :

   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   POSTGRES_PORT=5432
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>"
   AUTH_SECRET=
   ```

   `AUTH_SECRET` sert à signer/chiffrer le token de session (Auth.js). Générer une valeur avec :

   ```bash
   npx auth secret
   ```

3. Démarrer la base de données PostgreSQL :

   ```bash
   docker compose up -d
   ```

4. Appliquer le schéma de base de données :

   ```bash
   npm run db:migrate
   ```

5. Peupler la base avec des données de test :

   ```bash
   npm run db:seed
   ```

## Lancer le projet en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Scripts disponibles

| Commande            | Description                                      |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | Lance le serveur de développement Next.js         |
| `npm run build`      | Build de production                               |
| `npm run start`      | Lance le build de production                      |
| `npm run lint`       | Vérifie le code avec ESLint                       |
| `npm run db:migrate` | Crée/applique les migrations Prisma               |
| `npm run db:seed`    | Insère des données de test en base                |

## Modèle de données

- **User** : compte utilisateur (username, email, mot de passe hashé)
- **Topic** : thème auquel un utilisateur peut s'abonner
- **Post** : article publié par un utilisateur, associé à un topic
- **Comment** : commentaire d'un utilisateur sur un post
- **Subscription** : abonnement d'un utilisateur à un topic

Le schéma complet est défini dans [prisma/schema.prisma](prisma/schema.prisma).

## Authentification

- `/`, `/login` et `/register` sont publiques ; toutes les autres routes (ex. `/posts`) nécessitent une session.
- La protection des routes est faite dans [proxy.ts](proxy.ts), qui lit le token de session via `getToken()` (Auth.js) sur chaque requête.
- La configuration du provider `Credentials` (validation, hash du mot de passe) est dans [lib/auth.ts](lib/auth.ts).
